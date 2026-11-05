// Word-Level Text Diff Calculator for Human Review Hub

export interface DiffToken {
  type: 'EQUAL' | 'INSERT' | 'DELETE';
  text: string;
}

export function computeWordDiff(original: string, modified: string): DiffToken[] {
  if (!original && !modified) return [];
  if (!original) return [{ type: 'INSERT', text: modified }];
  if (!modified) return [{ type: 'DELETE', text: original }];
  if (original === modified) return [{ type: 'EQUAL', text: original }];

  const origWords = original.split(/(\s+)/);
  const modWords = modified.split(/(\s+)/);

  // Simple Longest Common Subsequence (LCS) matrix for word diff
  const n = origWords.length;
  const m = modWords.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (origWords[i] === modWords[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to extract tokens
  let i = n;
  let j = m;
  const tokens: DiffToken[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origWords[i - 1] === modWords[j - 1]) {
      tokens.unshift({ type: 'EQUAL', text: origWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tokens.unshift({ type: 'INSERT', text: modWords[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      tokens.unshift({ type: 'DELETE', text: origWords[i - 1] });
      i--;
    }
  }

  // Merge consecutive tokens of same type
  const merged: DiffToken[] = [];
  for (const t of tokens) {
    if (merged.length > 0 && merged[merged.length - 1].type === t.type) {
      merged[merged.length - 1].text += t.text;
    } else {
      merged.push({ ...t });
    }
  }

  return merged;
}
