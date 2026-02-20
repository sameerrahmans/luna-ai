"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("luna_chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("luna_chat", JSON.stringify(messages));
    if (messages.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [messages]);

  const typeAnimation = async (text: string) => {
    let current = "";
    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    for (let i = 0; i < text.length; i++) {
      current += text[i];
      await new Promise((r) => setTimeout(r, 8));
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

    setTimeout(() => inputRef.current?.focus(), 0);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    await typeAnimation(data.reply);
  };

  const InputBox = (
    <div className="flex gap-3 items-center w-full min-w-0">
      <input
        ref={inputRef}
        className="flex-1 min-w-0 border border-gray-300 rounded-lg px-5 py-3 text-base font-medium outline-none focus:border-[#0000FF] transition"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder="Ask me anything..."
      />
      <button
        onClick={sendMessage}
        className="bg-[#0000FF] text-white rounded-lg px-4 py-3 hover:opacity-90 transition flex items-center justify-center cursor-pointer"
      >
        <Send size={20} strokeWidth={2} />
      </button>
    </div>
  );

  return (
    <main className="min-h-[100dvh] bg-white flex flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center">
          <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center text-center gap-8">
            <h1 className="text-2xl sm:text-4xl font-medium tracking-tight text-gray-900">
              Where should we begin?
            </h1>
            <div className="w-full">{InputBox}</div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto w-full">
            <div className="max-w-3xl w-full mx-auto px-4 py-10 space-y-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-5 py-3 text-base font-medium leading-relaxed rounded-lg max-w-[85%] sm:max-w-[70%] ${
                      m.role === "user"
                        ? "bg-[#0000FF] text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white p-4 sticky bottom-0 w-full">
            <div className="w-full max-w-3xl mx-auto px-4">{InputBox}</div>

            <div className="text-center text-[10px] sm:text-xs text-gray-400 mt-3">
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
            </div>
          </div>
        </>
      )}
    </main>
  );
}
