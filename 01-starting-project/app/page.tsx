export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold mb-6">Hello World</h1>
        <h2 className="text-2xl font-semibold mb-3">Advantages of Claude Code</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Works directly in your terminal with full codebase context</li>
          <li>Reads, writes, and edits files autonomously</li>
          <li>Runs shell commands, tests, and builds on your behalf</li>
          <li>Understands entire project structure, not just individual files</li>
          <li>Supports agentic workflows for complex multi-step tasks</li>
          <li>Integrates with Git for commits, diffs, and branch management</li>
          <li>Extensible via MCP servers and custom hooks</li>
        </ul>
      </div>
    </div>
  );
}
