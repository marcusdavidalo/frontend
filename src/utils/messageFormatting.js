import React from "react";
import CodeBlock from "../components/main/Chatbox/CodeBlock";

export const formatMessage = (content) => {
  // First, extract thinking sections
  const thinkingRegex = /<think>([\s\S]*?)<\/think>/g;
  const thinkingMatches = [...(content.match(thinkingRegex) || [])];

  if (thinkingMatches.length === 0) {
    // No thinking tags found, process content normally
    return formatRegularContent(content);
  }

  // Replace thinking sections with placeholders to preserve codeblocks inside thinking
  let processedContent = content;
  const thinkingSections = [];

  thinkingMatches.forEach((match, index) => {
    const thinkingContent = match.replace(/<think>|<\/think>/g, "").trim();
    thinkingSections.push(thinkingContent);
    processedContent = processedContent.replace(
      match,
      `__THINKING_SECTION_${index}__`
    );
  });

  // Process the content with placeholders
  const parts = processedContent
    .split(/(.*?__THINKING_SECTION_\d+__.*?)/g)
    .filter(Boolean);

  return parts.flatMap((part) => {
    if (part.includes("__THINKING_SECTION_")) {
      // This part contains a thinking section placeholder
      const sections = [];
      const regex = /__THINKING_SECTION_(\d+)__/;
      const beforeAndAfter = part.split(regex);

      if (beforeAndAfter[0]) {
        sections.push(
          <span key={`before-${beforeAndAfter[0]}`}>
            {formatRegularContent(beforeAndAfter[0])}
          </span>
        );
      }

      if (beforeAndAfter[1]) {
        const index = parseInt(beforeAndAfter[1], 10);
        sections.push(
          <div key={`thinking-${index}`} className="thinking-section mt-2 mb-2">
            <details>
              <summary className="text-gray-500 italic cursor-pointer mb-1">
                Show AI's reasoning process
              </summary>
              <div className="pl-4 pt-2 border-l-2 border-gray-300 mt-1 mb-2 thinking-content">
                {formatRegularContent(thinkingSections[index])}
              </div>
            </details>
          </div>
        );
      }

      if (beforeAndAfter[2]) {
        sections.push(
          <span key={`after-${beforeAndAfter[2]}`}>
            {formatRegularContent(beforeAndAfter[2])}
          </span>
        );
      }

      return sections;
    } else {
      // Regular content without thinking placeholders
      return formatRegularContent(part);
    }
  });
};

// Helper function to handle regular content with code blocks
const formatRegularContent = (content) => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const parts = content.split(codeBlockRegex);
  const codeBlocks = content.match(codeBlockRegex) || [];

  return parts.reduce((acc, part, index) => {
    // Add text content
    if (part.trim()) {
      acc.push(<span key={`text-${index}`}>{part}</span>);
    }

    // Add code block if available for this part
    if (index < codeBlocks.length) {
      const code = codeBlocks[index].replace(/```/g, "").trim();
      acc.push(<CodeBlock key={`code-${index}`} code={code} />);
    }

    return acc;
  }, []);
};
