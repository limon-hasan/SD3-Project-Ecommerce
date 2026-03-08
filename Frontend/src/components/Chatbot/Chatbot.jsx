import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const Chatbot = () => {
    // 1. ALL HOOKS MUST BE AT THE TOP
    const [isOpen, setIsOpen] = useState(false);
    const { user, products, fetchMyOrders } = useShop();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [lastDiscussedProduct, setLastDiscussedProduct] = useState(null);
    const messagesEndRef = useRef(null);

    // Helper to get storage key
    const getStorageKey = (u) => `chat_history_${u ? u._id : 'guest'}`;

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load history
    useEffect(() => {
        const key = getStorageKey(user);
        const savedMessages = localStorage.getItem(key);

        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            setMessages([{
                text: user ? `Hi ${user.name}! 👋 I'm your ShopSphere friend. Need help shopping or just want to chat?` : "Hi there! 👋 I'm your virtual shopping friend. How's it going?",
                sender: 'bot'
            }]);
        }
    }, [user]);

    // Save history
    useEffect(() => {
        if (messages.length > 0) {
            const key = getStorageKey(user);
            localStorage.setItem(key, JSON.stringify(messages));
        }
        scrollToBottom();
    }, [messages, user]);

    // Friendly Logic
    const getSmallTalkResponse = (input) => {
        const lower = input.toLowerCase();
        const greetings = ["doing great!", "feeling wonderful today!", "super happy to help you!", "chilling in the cloud ☁️"];
        const jokes = [
            "Why did the mobile phone need glasses? Because it lost all its contacts! 📱",
            "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
            "What did the shopper say to the sale item? You're a steal! 💸"
        ];

        if (lower.match(/\b(hi|hello|hey|yo)\b/)) return `Hey there! 👋 What's on your mind?`;
        if (lower.includes("how are you")) return `I'm ${greetings[Math.floor(Math.random() * greetings.length)]} How about you?`;
        if (lower.includes("good") || lower.includes("great") || lower.includes("fine")) return "That's amazing to hear! 🎉 Ready to find some cool stuff?";
        if (lower.includes("bad") || lower.includes("sad") || lower.includes("tired")) return "Aww, I'm sorry to hear that. 🥺 Maybe some retail therapy would help?";
        if (lower.includes("joke") || lower.includes("funny")) return jokes[Math.floor(Math.random() * jokes.length)];
        if (lower.includes("love you")) return "Aww, stop it! You're making my circuits blush! 😳❤️";
        if (lower.includes("name")) return "I'm ShopSphere Assistant, but you can call me Sphere! 🤖";
        if (lower.includes("cool") || lower.includes("wow") || lower.includes("nice")) return "Right?? 😎";

        return null;
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // SIMULATED TYPING DELAY (Shortened for "immediate" feel)
        setTimeout(async () => {
            let botResponseText = "";
            const lowerInput = input.toLowerCase();

            // --- 1. CONTEXTUAL FOLLOW-UP (Details, Specs, Ratings) ---
            if (lastDiscussedProduct) {
                if (lowerInput.includes('more') || lowerInput.includes('detail') || lowerInput.includes('desc') || lowerInput.includes('about')) {
                    botResponseText = `Here's more info on the **${lastDiscussedProduct.name}**: ${lastDiscussedProduct.description}`;
                }
                else if (lowerInput.includes('rating') || lowerInput.includes('review') || lowerInput.includes('good')) {
                    botResponseText = `The **${lastDiscussedProduct.name}** is rated ⭐ **${lastDiscussedProduct.rating}/5** (${lastDiscussedProduct.numReviews} reviews). Customers love it!`;
                }
                else if (lowerInput.includes('brand') || lowerInput.includes('make')) {
                    botResponseText = `It's a genuine product from **${lastDiscussedProduct.brand}**.`;
                }
            }

            // --- 2. BROAD CATEGORY SEARCH ("Watches", "Bags") ---
            if (!botResponseText && lowerInput.includes('have') && (lowerInput.includes('watch') || lowerInput.includes('phone') || lowerInput.includes('camera') || lowerInput.includes('bag') || lowerInput.includes('shoe') || lowerInput.includes('perfume'))) {
                const keyword = lowerInput.match(/(watch|phone|camera|bag|shoe|perfume)/)?.[0];
                if (keyword) {
                    const categoryMatches = products.filter(p =>
                        p.category.toLowerCase().includes(keyword) ||
                        p.name.toLowerCase().includes(keyword)
                    );
                    if (categoryMatches.length > 0) {
                        const names = categoryMatches.map(p => p.name).slice(0, 3).join(", ");
                        botResponseText = `Yes! We have a great selection of ${keyword}s like: **${names}**... and more!`;
                        setLastDiscussedProduct(categoryMatches[0]);
                    } else {
                        botResponseText = `I don't have any specific ${keyword}s right now, but I have other cool stuff!`;
                    }
                }
            }

            // --- 3. CATALOG OVERVIEW ---
            if (!botResponseText && (lowerInput.includes('what') && lowerInput.includes('product'))) {
                const categories = [...new Set(products.map(p => p.category))];
                botResponseText = `We carry premium products in **${categories.join(", ")}**. Ask me about anything specific!`;
            }

            // --- 4. SPECIFIC PRODUCT SEARCH (Deep Search) ---
            // scanned name, brand, AND category for better matches
            if (!botResponseText) {
                const foundProduct = products.find(p => {
                    const nameMatch = lowerInput.includes(p.name.toLowerCase());
                    const brandMatch = p.brand && lowerInput.includes(p.brand.toLowerCase());
                    const categoryMatch = p.category && lowerInput.includes(p.category.toLowerCase());
                    // Allow finding by partial keyword if it's significant (length > 3)
                    const descMatch = lowerInput.length > 4 && p.name.toLowerCase().split(' ').some(word => word.length > 4 && lowerInput.includes(word));

                    return nameMatch || (brandMatch && lowerInput.includes('have')) || categoryMatch || descMatch;
                });

                if (foundProduct) {
                    botResponseText = `I found the **${foundProduct.name}**! It's in stock for **$${foundProduct.price}**. \n\n*${foundProduct.description.substring(0, 80)}...* \n\nWant to know more?`;
                    setLastDiscussedProduct(foundProduct);
                }
            }

            // --- 5. ORDERS & ACCOUNT ---
            if (!botResponseText && (lowerInput.includes('order') || lowerInput.includes('track') || lowerInput.includes('where'))) {
                const myOrders = await fetchMyOrders();
                if (myOrders && myOrders.length > 0) {
                    const lastOrder = myOrders[0];
                    const status = lastOrder.isDelivered ? "Delivered 📦" : lastOrder.isPaid ? "Paid & Processing 🎁" : "Pending Payment ⏳";
                    botResponseText = `Your last order (#${lastOrder._id.substring(0, 4)}) is **${status}**. Total: $${lastOrder.totalPrice}.`;
                } else {
                    botResponseText = "You haven't placed any orders yet. Let's find you something special! 🛍️";
                }
            }

            // --- 6. SYSTEM COMMANDS ---
            if (!botResponseText) {
                if (lowerInput.includes('clear')) {
                    setMessages([{ text: "Chat history cleared. ✨", sender: 'bot' }]);
                    return;
                }
                if (lowerInput.includes('thank')) botResponseText = "You're very welcome! Happy shopping! 💖";
                if (lowerInput.includes('shipping')) botResponseText = "We offer **Free Express Shipping** on all luxury items! 🚚💨";
                if (lowerInput.includes('bye')) botResponseText = "Goodbye! Come back soon! 👋";
                if (lowerInput.includes('help')) botResponseText = "I can help you find products, check prices, track orders, or just chat! Try asking 'Do you have watches?'";
            }

            // --- 7. SMALL TALK / FALLBACK ---
            if (!botResponseText) {
                const smallTalk = getSmallTalkResponse(input);
                if (smallTalk) {
                    botResponseText = smallTalk;
                } else {
                    botResponseText = "That's interesting! Tell me more, or ask me about our latest **Watches** or **Bags**! 🎧";
                }
            }

            if (botResponseText) {
                setMessages(prev => [...prev, { text: botResponseText, sender: 'bot' }]);
            }
        }, 600); // Reduced delay for snappier feel
    };

    // 2. CHECK CONDITION AFTER ALL HOOKS
    if (!user) return null;

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button className="chatbot-toggle" onClick={toggleChat}>
                    💬
                </button>
            )}
            {isOpen && (
                <div className="chatbot-window glass">
                    <div className="chatbot-header">
                        <h3>Sphere 🤖</h3>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="close-btn" onClick={() => {
                                if (window.confirm('Clear chat history?')) {
                                    setMessages([{ text: "Memory wiped! 🧼", sender: 'bot' }]);
                                }
                            }} style={{ fontSize: '0.8rem', padding: '2px 5px' }}>🗑️</button>
                            <button className="close-btn" onClick={toggleChat}>×</button>
                        </div>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chatbot-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Say hi or ask about items..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit">➤</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
