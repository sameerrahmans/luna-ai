"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Load from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("luna_chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  /* Save to localStorage */
  useEffect(() => {
    localStorage.setItem("luna_chat", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const typeAnimation = async (text: string) => {
    let current = "";

    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      await new Promise((r) => setTimeout(r, 10));

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = current;
        return updated;
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    await typeAnimation(data.reply);
  };

  return (
    <main className="h-screen bg-white text-black flex flex-col">
      {/* Chat area */}
      <div className="flex-1 overflow-auto max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
              px-4 py-3 text-sm leading-relaxed
              ${
                m.role === "user"
                  ? "bg-black text-white rounded-lg"
                  : "bg-gray-100 text-black rounded-lg"
              }
            `}
            >
              {m.text}
            </div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Message Luna AI..."
          />

          <button
            onClick={sendMessage}
            className="bg-black text-white rounded-lg px-6 hover:opacity-90 transition"
          >
            Send
          </button>
        </div>

        {/* Footer Text */}
        <div className="text-center text-xs text-gray-400 mt-3">
          Luna AI is a{" "}
          <a
            href="https://saclen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black transition"
          >
            Saclen
          </a>{" "}
          product, developed by{" "}
          <a
            href="https://sameer.pro.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black transition"
          >
            Sameer Rahman
          </a>
          .
        </div>
      </div>
    </main>
  );
}
