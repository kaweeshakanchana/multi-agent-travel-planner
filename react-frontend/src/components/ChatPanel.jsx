import React, { useState, useRef, useEffect } from 'react';

const ChatPanel = ({ onUpdateSummary }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I am your AI travel agent. Where would you like to travel? I'll handle your entire trip from planning to booking.",
      sender: "assistant"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text) return;

    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          thread_id: threadId,
          message: text
        })
      });

      const data = await response.json();
      setThreadId(data.thread_id);
      
      if (data.response) {
        setMessages(prev => [...prev, { text: data.response, sender: 'assistant' }]);
      }

      // Update the parent's data state which controls the Summary panel
      onUpdateSummary(data);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, an error occurred communicating with the server.', 
        sender: 'assistant' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h2>Travel Agent</h2>
        <span className="status-indicator"></span>
      </div>
      
      <div className="chat-messages" id="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <div 
              className="message-content" 
              dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>') }}
            />
          </div>
        ))}
        
        {isLoading && (
          <div className="loading-indicator active">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="e.g. I want to travel from Tokyo to Seoul..."
          autoComplete="off"
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
