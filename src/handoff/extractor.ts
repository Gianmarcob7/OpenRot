import type { TranscriptMessage, HandoffData } from '../types.js';
import { getAssistantMessages, getUserMessages } from '../transcript/index.js';
import { extractWithRegex } from '../extract/regex.js';

/**
 * Extract handoff data from transcript messages.
 * Uses regex heuristics to identify completed work, in-progress tasks, and issues.
 */
export function extractHandoffData(
  messages: TranscriptMessage[],
  decisions: string[],
  projectName: string,
): HandoffData {
  const assistantTexts = getAssistantMessages(messages);
  const userTexts = getUserMessages(messages);

  const completed = extractCompleted(assistantTexts);
  const inProgress = extractInProgress(assistantTexts, userTexts);
  const unresolved = extractUnresolved(assistantTexts, userTexts);

  return {
    projectName,
    decisions,
    completed,
    inProgress,
    unresolved,
  };
}

/**
 * Extract completed work from assistant messages.
 */
function extractCompleted(assistantTexts: string[]): string[] {
  const completed: string[] = [];
  const seen = new Set<string>();

  const donePatterns = [
    /(?:I've|I have|we've|we have)\s+(?:created|built|implemented|added|set up|configured|written|updated|fixed|completed)\s+(.+?)(?:\.|$)/gi,
    /(?:created|built|implemented|added|set up|configured|updated|fixed)\s+(?:the\s+)?(.+?)(?:\s+(?:successfully|for you|as requested))/gi,
    /✅\s*(.+)/g,
    /Done[!.]?\s*(.+)/gi,
  ];

  for (const text of assistantTexts) {
    for (const pattern of donePatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim().substring(0, 100);
        if (item.length > 5 && !seen.has(item.toLowerCase())) {
          seen.add(item.toLowerCase());
          completed.push(item);
        }
      }
    }
  }

  return completed.slice(0, 20); // Limit to 20 items
}

/**
 * Extract in-progress work from the last few messages.
 */
function extractInProgress(assistantTexts: string[], userTexts: string[]): string[] {
  const inProgress: string[] = [];

  // Look at last few messages for work being done
  const lastAssistant = assistantTexts.slice(-3);
  const lastUser = userTexts.slice(-3);

  const progressPatterns = [
    /(?:I'm|I am|let me|I'll|I will)\s+(?:now\s+)?(?:working on|implementing|building|creating|adding|fixing|updating)\s+(.+?)(?:\.|$)/gi,
    /(?:next|now)\s+(?:I'll|let's|we'll)\s+(.+?)(?:\.|$)/gi,
  ];

  for (const text of [...lastAssistant, ...lastUser]) {
    for (const pattern of progressPatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim().substring(0, 100);
        if (item.length > 5) {
          inProgress.push(item);
        }
      }
    }
  }

  return inProgress.slice(0, 5);
}

/**
 * Extract unresolved issues from recent messages.
 */
function extractUnresolved(assistantTexts: string[], userTexts: string[]): string[] {
  const unresolved: string[] = [];

  const issuePatterns = [
    /(?:error|bug|issue|problem|fail(?:ure|ed|s)?|broken|doesn't work|not working|TODO)\s*[:\-]?\s*(.+?)(?:\.|$)/gi,
    /(?:need(?:s)? to|should|must)\s+(?:fix|resolve|address|handle|investigate)\s+(.+?)(?:\.|$)/gi,
  ];

  const recentTexts = [...assistantTexts.slice(-5), ...userTexts.slice(-5)];

  for (const text of recentTexts) {
    for (const pattern of issuePatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim().substring(0, 100);
        if (item.length > 5) {
          unresolved.push(item);
        }
      }
    }
  }

  return unresolved.slice(0, 10);
}
