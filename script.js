/* ============ VARIÁVEIS GLOBAIS ============ */
let vantaEffect = null;
let isDesktop = window.innerWidth > 768;

/* ============ INICIALIZAÇÃO DO VANTA BACKGROUND ============ */
function initVantaBackground() {
    try {
        if (typeof VANTA !== 'undefined' && typeof THREE !== 'undefined') {
            vantaEffect = VANTA.NET({
                el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x8a2be2,
                backgroundColor: 0x0a0a1a,
                points: isDesktop ? 8.00 : 4.00,
                maxDistance: isDesktop ? 25.00 : 15.00,
                spacing: isDesktop ? 18.00 : 25.00,
                showDots: true
            });
            console.log('✅ Vanta.js carregado com sucesso');
        } else {
            console.warn('⚠️ Vanta.js ou THREE.js não encontrados, usando fallback');
        }
    } catch (error) {
        console.warn('⚠️ Erro ao carregar Vanta.js:', error);
    }
}

/* ============ ANIMAÇÕES DE ENTRADA ============ */
function initEntranceAnimations() {
    try {
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            // Animar fundo
            tl.to('.fundo', {
                opacity: 0.3,
                duration: 0.6,
                ease: "power2.out"
            })
            
            // Animar todos os elementos com stagger mínimo
            .fromTo(['.mesa', '.caixas', '.notebook', '.teclado', '.robo'], {
                y: 100,
                opacity: 0,
                scale: 0.8
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
                stagger: 0.05
            }, "-=0.4");
            
            console.log('✅ GSAP animações carregadas');
        } else {
            document.body.classList.add('fallback-animation');
            console.warn('⚠️ GSAP não encontrado, usando animações CSS de fallback');
        }
    } catch (error) {
        console.warn('⚠️ Erro no GSAP:', error);
        document.body.classList.add('fallback-animation');
    }
}

/* ============ EFEITO PARALLAX ============ */
function initParallaxEffect() {
    if (!isDesktop) return;
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        // Movimento do robô
        const robo = document.querySelector('.robo');
        if (robo) {
            gsap.to(robo, {
                duration: 0.3,
                rotationY: x * 3,
                rotationX: -y * 2,
                x: x * 15,
                y: y * 10,
                ease: "power2.out"
            });
        }
        
        // Controle do Vanta
        if (vantaEffect) {
            vantaEffect.setOptions({
                mouseControls: true,
                gyroControls: false
            });
        }
        
        // Movimento dos outros elementos
        gsap.to('.notebook', {
            duration: 0.4,
            x: x * 8,
            y: -y * 5,
            rotationY: x * 2,
            ease: "power2.out"
        });
        
        gsap.to('.caixas', {
            duration: 0.45,
            x: x * 5,
            y: -y * 3,
            ease: "power2.out"
        });
        
        gsap.to('.teclado', {
            duration: 0.35,
            x: x * 6,
            y: -y * 4,
            ease: "power2.out"
        });
    });
}

/* ============ EFEITOS DE HOVER ============ */
function initHoverEffects() {
    const elements = [
        { selector: '.robo', scale: 1.03, glow: 40 },
        { selector: '.notebook', scale: 1.06, glow: 30 },
        { selector: '.teclado', scale: 1.05, glow: 25 },
        { selector: '.caixas', scale: 1.04, glow: 35 },
        { selector: '.mesa', scale: 1.01, glow: 25 }
    ];
    
    elements.forEach(({ selector, scale }) => {
        const element = document.querySelector(selector);
        if (!element) return;
        
        element.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(element, {
                    scale: scale,
                    y: selector !== '.mesa' ? -8 : 0,
                    duration: 0.2,
                    ease: "back.out(1.7)"
                });
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(element, {
                    scale: 1,
                    y: 0,
                    duration: 0.2,
                    ease: "back.out(1.7)"
                });
            }
        });
    });
}

/* ============ OTIMIZAÇÕES MOBILE ============ */
function optimizeForMobile() {
    if (!isDesktop) {
        const style = document.createElement('style');
        style.textContent = `
            .robo, .notebook, .teclado, .caixas, .mesa {
                animation: none !important;
                filter: none !important;
            }
            .particles-overlay {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log('📱 Otimizações mobile aplicadas');
    }
}

/* ============ REDIMENSIONAMENTO ============ */
function handleResize() {
    const newIsDesktop = window.innerWidth > 768;
    
    if (newIsDesktop !== isDesktop) {
        isDesktop = newIsDesktop;
        
        if (vantaEffect) {
            vantaEffect.destroy();
            setTimeout(initVantaBackground, 50);
        }
        
        optimizeForMobile();
    }
}

/* ============ INICIALIZAÇÃO PRINCIPAL ============ */
function init() {
    console.log('🚀 Inicializando cenário futurista...');
    
    optimizeForMobile();
    initVantaBackground();
    initEntranceAnimations();
    initParallaxEffect();
    initHoverEffects();
    
    window.addEventListener('resize', handleResize);
    
    console.log('✅ Cenário futurista carregado!');
}

/* ============ FUNÇÕES AUXILIARES ============ */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const numberOfParticles = isDesktop ? 50 : 20;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

function enviarMensagem() {
    const input = document.getElementById('input');
    const mensagens = document.getElementById('mensagens');

    if (!input || !mensagens) return;

    const msg = input.value.trim();
    if (msg === "") return;

    mensagens.innerHTML += `<div><strong>Você:</strong> ${msg}</div>`;
    input.value = "";

    setTimeout(() => {
        mensagens.innerHTML += `<div><strong>Prod.AI:</strong> Resposta automática para: "${msg}"</div>`;
        mensagens.scrollTop = mensagens.scrollHeight;
    }, 500);
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

/* ============ LIMPEZA ============ */
window.addEventListener('beforeunload', () => {
    if (vantaEffect) {
        vantaEffect.destroy();
    }
});

/* ============ CLASSE CHATBOT PROD.AI ============ */
class ProdAIChatbot {
    constructor() {
        this.isActive = false;
        this.messageCount = 0;
        this.responses = [
            "Excelente pergunta! Como especialista em produtividade, vou te ajudar a otimizar essa área. Baseado em dados de performance, recomendo focar em técnicas de time-blocking e automação de tarefas repetitivas.",
            "Analisando sua questão, identifico uma oportunidade de melhoria significativa. Vou te guiar através de estratégias comprovadas para maximizar seus resultados e eficiência.",
            "Interessante! Como sua mentora virtual, posso te ensinar métodos avançados de gestão de tempo. Que tal implementarmos a técnica Pomodoro combinada com análise de métricas de produtividade?",
            "Processando seus dados... Detectei padrões que podem ser otimizados. Vou te mostrar como aplicar princípios de alta performance para alcançar seus objetivos de forma mais eficiente.",
            "Baseado em minha análise, essa é uma área onde podemos implementar melhorias substanciais. Te ensino técnicas de foco profundo e eliminação de distrações que aumentam a produtividade em até 40%.",
            "Excelente! Vamos trabalhar juntos para transformar sua abordagem. Posso te mostrar frameworks de produtividade usados por profissionais de elite que vão revolucionar seu workflow.",
            "Como IA especializada em performance, identifico uma oportunidade única aqui. Vou te ensinar estratégias de otimização que combinam neurociência e gestão de tempo para resultados extraordinários.",
            "Fascinante questão! Vou te guiar através de metodologias avançadas de produtividade. Juntos, vamos criar um sistema personalizado que se adapta ao seu estilo de trabalho e maximiza seus resultados."
        ];
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.waitForPageLoad();
    }
    
    setupElements() {
        // Container principal
        this.container = document.getElementById('chatbotContainer');
        
        // Estado Welcome
        this.welcomeState = document.getElementById('chatbotWelcomeState');
        this.mainRobot = document.getElementById('chatbotMainRobot');
        this.mainTitle = document.getElementById('chatbotMainTitle');
        this.mainSubtitle = document.getElementById('chatbotMainSubtitle');
        this.branding = document.getElementById('chatbotBranding');
        this.inputSection = document.getElementById('chatbotInputSection');
        this.mainInput = document.getElementById('chatbotMainInput');
        this.sendButton = document.getElementById('chatbotSendButton');
        
        // Estado Ativo
        this.activeState = document.getElementById('chatbotActiveState');
        this.headerBar = document.getElementById('chatbotHeaderBar');
        this.conversationArea = document.getElementById('chatbotConversationArea');
        this.typingIndicator = document.getElementById('chatbotTypingIndicator');
        this.activeInput = document.getElementById('chatbotActiveInput');
        this.activeSendBtn = document.getElementById('chatbotActiveSendBtn');
    }
    
    setupEventListeners() {
        // Eventos do estado Welcome
        this.sendButton.addEventListener('click', () => this.handleFirstMessage());
        this.mainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleFirstMessage();
        });
        this.mainInput.addEventListener('focus', () => this.animateInputFocus());
        
        // Eventos do estado Ativo
        this.activeSendBtn.addEventListener('click', () => this.sendMessage());
        this.activeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    
    waitForPageLoad() {
        const checkPageReady = () => {
            const images = document.querySelectorAll('img');
            let allImagesLoaded = true;
            
            images.forEach(img => {
                if (!img.complete || img.naturalHeight === 0) {
                    allImagesLoaded = false;
                }
            });
            
            const librariesLoaded = typeof gsap !== 'undefined' && typeof VANTA !== 'undefined';
            
            if (allImagesLoaded && librariesLoaded) {
                setTimeout(() => {
                    this.animateInitialAppearance();
                }, 800);
            } else {
                setTimeout(checkPageReady, 50);
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkPageReady);
        } else {
            checkPageReady();
        }
    }
    
    animateInitialAppearance() {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(this.container, 
                { 
                    scale: 0.7, 
                    opacity: 0,
                    rotationY: 20,
                    y: 50
                },
                { 
                    scale: 1, 
                    opacity: 1,
                    rotationY: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }
            );
            
            const tl = gsap.timeline({ delay: 0.15 });
            
            tl.fromTo([this.mainRobot, this.mainTitle, this.mainSubtitle, this.inputSection], 
                { scale: 0.5, opacity: 0, y: 30 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.5, 
                    ease: "back.out(1.7)",
                    stagger: 0.05
                }
            );
        } else {
            this.container.style.opacity = '1';
        }
    }
    
    animateInputFocus() {
        if (typeof gsap !== 'undefined') {
            gsap.to(this.inputSection, {
                scale: 1.02,
                duration: 0.15,
                ease: "power2.out"
            });
        }
    }
    
    handleFirstMessage() {
        const message = this.mainInput.value.trim();
        if (!message) {
            this.shakeInput();
            return;
        }
        
        this.activateChat(message);
    }
    
    shakeInput() {
        if (typeof gsap !== 'undefined') {
            gsap.to(this.inputSection, {
                x: -10,
                duration: 0.05,
                repeat: 5,
                yoyo: true,
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.set(this.inputSection, { x: 0 });
                }
            });
        }
    }
    
    activateChat(firstMessage) {
        if (this.isActive) return;
        this.isActive = true;
        
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            tl.to([this.mainRobot, this.branding], {
                opacity: 0,
                y: -60,
                scale: 0.8,
                duration: 0.3,
                ease: "power2.inOut"
            })
            
            .to(this.container, {
                width: 850,
                height: 750,
                duration: 0.4,
                ease: "back.out(1.7)"
            }, "-=0.15")
            
            .set(this.welcomeState, { display: 'none' })
            .set(this.activeState, { display: 'flex' })
            
            .fromTo([this.activeState, this.headerBar, this.conversationArea, '.chatbot-input-area'], 
                { opacity: 0, y: 20 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.4, 
                    ease: "power2.out",
                    stagger: 0.05
                }
            );
        } else {
            this.welcomeState.style.display = 'none';
            this.activeState.style.display = 'flex';
            this.activeState.classList.add('active');
            this.container.classList.add('expanded');
        }
        
        setTimeout(() => {
            this.addMessage(firstMessage, 'user');
            this.activeInput.focus();
            
            setTimeout(() => {
                this.showTyping();
                setTimeout(() => {
                    this.hideTyping();
                    const response = this.getRandomResponse();
                    this.addMessage(response, 'assistant');
                }, 800);
            }, 200);
        }, 800);
    }
    
    sendMessage() {
        const message = this.activeInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.activeInput.value = '';
        
        setTimeout(() => {
            this.showTyping();
            setTimeout(() => {
                this.hideTyping();
                const response = this.getRandomResponse();
                this.addMessage(response, 'assistant');
            }, 600 + Math.random() * 400);
        }, 100);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message chatbot-message-${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'chatbot-message-avatar';
        avatar.innerHTML = sender === 'assistant' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'chatbot-message-content';
        
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-message-bubble';
        bubble.textContent = text;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'chatbot-message-timestamp';
        timestamp.textContent = this.getCurrentTime();
        
        content.appendChild(bubble);
        content.appendChild(timestamp);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.conversationArea.appendChild(messageDiv);
        this.scrollToBottom();
        
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(messageDiv, 
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "back.out(1.7)" }
            );
        }
        
        this.messageCount++;
    }
    
    showTyping() {
        this.typingIndicator.classList.add('active');
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.typingIndicator.classList.remove('active');
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.conversationArea.scrollTop = this.conversationArea.scrollHeight;
        }, 25);
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    getRandomResponse() {
        return this.responses[Math.floor(Math.random() * this.responses.length)];
    }
    
    // Método para resetar o chatbot
    reset() {
        this.isActive = false;
        this.messageCount = 0;
        this.mainInput.value = '';
        this.activeInput.value = '';
        
        this.welcomeState.style.display = 'flex';
        this.activeState.style.display = 'none';
        this.activeState.classList.remove('active');
        this.container.classList.remove('expanded');
        
        const messages = this.conversationArea.querySelectorAll('.chatbot-message:not(.chatbot-message:first-child)');
        messages.forEach(msg => msg.remove());
        
        this.hideTyping();
    }
}

/* ============ INICIALIZAÇÃO E BOTÕES DE AÇÃO ============ */
window.addEventListener('load', () => {
    setTimeout(init, 25);
    
    setTimeout(() => {
        window.prodAIChatbot = new ProdAIChatbot();
        console.log('🤖 PROD.AI Chatbot inicializado!');
    }, 50);
});

function resetChatbot() {
    if (window.prodAIChatbot) {
        window.prodAIChatbot.reset();
        console.log('🔄 Chatbot resetado');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const actionButtons = document.querySelectorAll('.chatbot-action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'upgrade':
                    console.log('Redirecionando para upgrade...');
                    break;
                case 'manage':
                    console.log('Abrindo gerenciamento de conta...');
                    break;
                case 'logout':
                    console.log('Fazendo logout...');
                    break;
            }
        });
    });
});

