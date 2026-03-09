document.addEventListener('DOMContentLoaded', () => {

    // --- Splash Screen Logic ---
    const splashScreen = document.getElementById('splash-screen');
    const authView = document.getElementById('auth-view');

    setTimeout(() => {
        if (splashScreen) {
            splashScreen.style.opacity = '0';
            splashScreen.style.visibility = 'hidden';
            setTimeout(() => splashScreen.remove(), 500); // Remove from DOM after transition
        }
    }, 2000); // 2 seconds splash screen

    // --- Authentication ---
    const loginForm = document.getElementById('login-form');
    const mainApp = document.getElementById('main-app');

    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate Authentication
            const btn = loginForm.querySelector('.btn-primary');
            const originalText = btn.textContent;
            btn.textContent = 'Logging in...';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                authView.classList.add('hidden');
                mainApp.classList.remove('hidden');
                btn.textContent = originalText;
                btn.style.opacity = '1';
                // Trigger animation for home view
                document.getElementById('home-view').style.animation = 'none';
                setTimeout(() => document.getElementById('home-view').style.animation = '', 10);
            }, 800);
        });
    }

    // --- Navigation ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.views-container > .view');
    const headerTitle = document.getElementById('header-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked item
            item.classList.add('active');
            
            // Hide all views
            views.forEach(view => {
                view.classList.add('hidden');
                view.classList.remove('active');
            });
            
            // Show target view
            const targetId = item.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.remove('hidden');
                targetView.classList.add('active');
                
                // Re-trigger animation
                targetView.style.animation = 'none';
                targetView.offsetHeight; /* trigger reflow */
                targetView.style.animation = null; 
            }
            
            // Update Header
            const title = item.querySelector('span').textContent;
            headerTitle.textContent = title;
        });
    });

    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        });
    }

    // --- Logout ---
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            mainApp.classList.add('hidden');
            authView.classList.remove('hidden');
            // Reset nav to home
            navItems[0].click();
        });
    }

    // --- Post Interactions ---
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.innerHTML.includes('heart')) {
                this.classList.toggle('liked');
                const icon = this.querySelector('i');
                if (this.classList.contains('liked')) {
                    icon.className = 'ri-heart-fill';
                    // Increment count roughly
                    const textNode = Array.from(this.childNodes).find(n => n.nodeType === 3);
                    if(textNode) textNode.textContent = ' ' + (parseInt(textNode.textContent) + 1);
                } else {
                    icon.className = 'ri-heart-line';
                    const textNode = Array.from(this.childNodes).find(n => n.nodeType === 3);
                    if(textNode) textNode.textContent = ' ' + (parseInt(textNode.textContent) - 1);
                }
            }
        });
    });

    // --- Overlays (Chat and Voice Room) ---
    const chatOverlay = document.getElementById('chat-overlay');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatTitle = document.getElementById('chat-title');
    const msgInput = document.getElementById('msg-input');
    const sendMsgBtn = document.getElementById('send-msg-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Make global for inline onclick
    window.openChat = function(name) {
        chatTitle.textContent = name;
        chatOverlay.classList.remove('hidden');
    };

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatOverlay.classList.add('hidden');
        });
    }

    // Send Message
    if (sendMsgBtn && msgInput) {
        const sendMsg = () => {
            const text = msgInput.value.trim();
            if (text) {
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const bubble = document.createElement('div');
                bubble.className = 'message-bubble sent';
                bubble.innerHTML = `
                    ${text}
                    <span class="msg-time">${timeStr} <i class="ri-check-line"></i></span>
                `;
                
                chatMessages.appendChild(bubble);
                msgInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate reply
                setTimeout(() => {
                    const reply = document.createElement('div');
                    reply.className = 'message-bubble received';
                    reply.innerHTML = `
                        <span class="sender-name">System</span>
                        This is an automated demo reply!
                        <span class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    `;
                    chatMessages.appendChild(reply);
                    chatMessages.scrollTop = chatMessages.scrollHeight;

                    // Update checks on sent message
                    bubble.querySelector('.ri-check-line').className = 'ri-check-double-line';
                    bubble.querySelector('.ri-check-double-line').style.color = '#60a5fa';
                }, 1500);
            }
        };

        sendMsgBtn.addEventListener('click', sendMsg);
        msgInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMsg();
        });
    }

    // Room Overlay
    const roomOverlay = document.getElementById('room-overlay');
    const leaveRoomBtn = document.getElementById('leave-room-btn');
    const roomTitle = document.getElementById('room-title');

    window.joinRoom = function(name) {
        roomTitle.textContent = name;
        roomOverlay.classList.remove('hidden');
    };

    if (leaveRoomBtn) {
        leaveRoomBtn.addEventListener('click', () => {
            roomOverlay.classList.add('hidden');
        });
    }

    // --- Global Overlay Management ---
    window.openOverlay = function(id) {
        const overlay = document.getElementById(id);
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    };

    window.closeOverlay = function(id) {
        const overlay = document.getElementById(id);
        if (overlay) {
            overlay.classList.add('hidden');
        }
    };

    // --- Bookmark Chat Feature ---
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    bookmarkBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent other clicks
            this.classList.toggle('saved');
            const icon = this.querySelector('i');
            if (this.classList.contains('saved')) {
                icon.className = 'ri-bookmark-fill';
                // In a real app we would save the message data to an array here
            } else {
                icon.className = 'ri-bookmark-line';
            }
        });
    });
    
    const leaveDangerBtn = roomOverlay ? roomOverlay.querySelector('.btn-outline-danger') : null;
    if (leaveDangerBtn) {
        leaveDangerBtn.addEventListener('click', () => {
            roomOverlay.classList.add('hidden');
        });
    }

    // Room voice toggle
    const mainMicControl = document.querySelector('.main-control');
    if (mainMicControl) {
        mainMicControl.addEventListener('click', () => {
            const icon = mainMicControl.querySelector('i');
            if (icon.classList.contains('ri-mic-off-fill')) {
                // Turn on mic
                icon.className = 'ri-mic-fill';
                mainMicControl.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                mainMicControl.style.color = 'var(--success)';
                mainMicControl.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                
                // Update avatar border
                const myAvatar = document.querySelector('.active-speaking .speaker-avatar img');
                if(myAvatar && !myAvatar.style.border) {
                    // simulate already having border in css
                }
            } else {
                // Turn off mic
                icon.className = 'ri-mic-off-fill';
                mainMicControl.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                mainMicControl.style.color = 'var(--danger)';
                mainMicControl.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }
        });
    }

    // --- AI Chat Feature ---
    const aiMsgInput = document.getElementById('ai-msg-input');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiChatMessages = document.getElementById('ai-chat-messages');

    window.sendAiMsg = function(textStr) {
        const text = textStr || (aiMsgInput ? aiMsgInput.value.trim() : '');
        if (text && aiChatMessages) {
            // Add user message
            const userBubble = document.createElement('div');
            userBubble.className = 'message-bubble sent';
            userBubble.innerHTML = `
                ${text}
                <div class="msg-footer"><span class="msg-time">Just now</span></div>
            `;
            aiChatMessages.appendChild(userBubble);
            if (aiMsgInput) aiMsgInput.value = '';
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

            // Show typing indicator
            const typingBubble = document.createElement('div');
            typingBubble.className = 'message-bubble received ai-msg typing-indicator';
            typingBubble.innerHTML = `
                <span class="sender-name"><i class="ri-robot-2-fill"></i> Campus AI</span>
                <div class="typing-dots">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
            aiChatMessages.appendChild(typingBubble);
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

            // Simulate AI response delay
            setTimeout(() => {
                typingBubble.remove();
                
                const responseBubble = document.createElement('div');
                responseBubble.className = 'message-bubble received ai-msg';
                
                let responseText = "I can definitely help with that! However, I'm currently running in demo mode. Try asking your campus admin for full access!";
                const lowerText = text.toLowerCase();
                
                // Tanglish Checks
                if (lowerText.match(/(bro|machi|da|epdi|enna|details|sollu|nanba|machan)/)) {
                    responseText = "Kandipa bro! Naan ungaluku help panren. Ethavathu doubt iruntha kelunga!";
                    if (lowerText.includes('unread') || lowerText.includes('message')) {
                        responseText = "Machi, unakaga 'Project Alpha' group la 3 unread messages iruku paaru.";
                    } else if (lowerText.includes('study')) {
                        responseText = "Bro, 2 active study groups iruku. Naan venum na join panni vidava?";
                    }
                } 
                // English Checks
                else {
                    if (lowerText.includes('unread')) {
                        responseText = "You have 3 unread messages in 'Project Alpha' about tomorrow's presentation.";
                    } else if (lowerText.includes('study')) {
                        responseText = "I found 2 active study groups for Data Structures right now. Want me to join one for you?";
                    }
                }

                responseBubble.innerHTML = `
                    <span class="sender-name"><i class="ri-magic-fill"></i> Magic AI</span>
                    <span>${responseText}</span>
                    <div class="msg-footer"><span class="msg-time">Just now</span></div>
                `;
                aiChatMessages.appendChild(responseBubble);
                aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            }, 1800);
        }
    };

    if (aiSendBtn && aiMsgInput) {
        aiSendBtn.addEventListener('click', () => sendAiMsg());
        aiMsgInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAiMsg();
        });
    }

    // --- Localization (i18n) ---
    const translations = {
        en: {
            app_name: "New Bonds",
            app_tagline: "Your campus, in your pocket.",
            email_placeholder: "Email or Phone Number",
            pass_placeholder: "Password",
            login_btn: "Log In",
            no_account: "Don't have an account?",
            signup: "Sign up",
            nav_home: "Home",
            nav_groups: "Groups",
            nav_feed: "Feed",
            nav_voice: "Voice",
            nav_profile: "Profile",
            latest_activity: "Latest Activity",
            saved_chats: "Saved Chats",
            account_settings: "Security & Settings",
            security_settings: "Security & Privacy",
            language: "Language",
            dark_mode: "Dark Mode",
            logout: "Log Out",
            two_step_verif: "Two-Step Verification",
            app_lock: "App Lock (Biometrics)",
            active_sessions: "Active Sessions (1)",
            storage: "Storage and Data",
            secured_by: "Secured by New Bonds E2E",
            ai_greeting: "Hello! I'm your campus assistant. How can I help you today?",
            ai_chip_1: "Summarize unread info",
            ai_chip_2: "Find active study groups",
            ai_placeholder: "Ask AI..."
        },
        ta: {
            app_name: "நியூ பாண்ட்ஸ்",
            app_tagline: "உங்கள் கல்லூரி, உங்கள் கைகளில்.",
            email_placeholder: "மின்னஞ்சல் அல்லது மொபைல்",
            pass_placeholder: "கடவுச்சொல்",
            login_btn: "உள்நுழைய",
            no_account: "கணக்கு இல்லையா?",
            signup: "பதிவு செய்க",
            nav_home: "முகப்பு",
            nav_groups: "குழுக்கள்",
            nav_feed: "பதிவுகள்",
            nav_voice: "குரல்",
            nav_profile: "சுயவிவரம்",
            latest_activity: "சமீபத்திய செயல்பாடுகள்",
            saved_chats: "சேமித்த செய்திகள்",
            account_settings: "பாதுகாப்பு & அமைப்புகள்",
            security_settings: "பாதுகாப்பு & தனியுரிமை",
            language: "மொழி",
            dark_mode: "டார்க் மோட்",
            logout: "வெளியேறு",
            two_step_verif: "இரண்டு-படி சரிபார்ப்பு",
            app_lock: "பயன்பாட்டு பூட்டு",
            active_sessions: "செயலில் உள்ள அமர்வுகள் (1)",
            storage: "தரவு மற்றும் சேமிப்பு",
            secured_by: "நியூ பாண்ட்ஸ் மூலம் பாதுகாக்கப்பட்டது",
            ai_greeting: "வணக்கம்! நான் உங்கள் கல்லூரி உதவியாளர். நான் எப்படி உதவ முடியும்?",
            ai_chip_1: "படிக்காத செய்திகளை சுருக்கு",
            ai_chip_2: "படிப்புக் குழுக்களைத் தேடு",
            ai_placeholder: "AI யிடம் கேளுங்கள்..."
        }
    };

    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            const dict = translations[lang] || translations['en'];
            
            // Translate text content
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) el.innerHTML = el.innerHTML.replace(el.textContent, dict[key]); // Preserve innerHTML tags if needed or just textContent
                if (dict[key] && !el.children.length) el.textContent = dict[key]; 
                else if (dict[key]) {
                  // Special handle for elements with children like the auth switch span
                   if (el.tagName === 'SPAN' || el.tagName === 'H1' || el.tagName === 'P' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'DIV' || el.tagName === 'BUTTON' || el.tagName === 'A') {
                       if(el.childNodes[0].nodeType === 3) el.childNodes[0].textContent = dict[key];
                       else el.textContent = dict[key];
                   }
                }
            });
            
            // Translate placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (dict[key]) el.placeholder = dict[key];
            });
        });
    }

});
