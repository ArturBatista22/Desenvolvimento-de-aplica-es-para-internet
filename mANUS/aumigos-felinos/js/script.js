// AUMIGOS FELINOS - JavaScript Principal
// Funcionalidades: Navegação, Carrinho, Formulários, Modais, Animações

// Variáveis Globais
let cart = JSON.parse(localStorage.getItem('aumigos-cart')) || [];
let currentStep = 1;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    initializeNavigation();
    initializeCart();
    initializeModals();
    initializeForms();
    initializeAnimations();
    initializeTabs();
    initializeFilters();
    initializeFAQ();
    updateCartDisplay();
}

// ===== NAVEGAÇÃO =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== CARRINHO DE COMPRAS =====
function initializeCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    
    // Abrir carrinho
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            openCart();
        });
    }
    
    // Fechar carrinho
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            closeCart();
        });
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function() {
            closeCart();
        });
    }
    
    // Adicionar produtos ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = parseFloat(this.dataset.price);
            
            addToCart(productId, productName, productPrice);
        });
    });
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCart();
    showNotification('Produto adicionado ao carrinho!', 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    saveCart();
}

function updateQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
            removeFromCart(id);
        } else {
            updateCartDisplay();
            saveCart();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const sidebarCartItems = document.getElementById('sidebarCartItems');
    const sidebarSubtotal = document.getElementById('sidebarSubtotal');
    const sidebarTotal = document.getElementById('sidebarTotal');
    
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Atualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    if (cartTotal) cartTotal.textContent = formattedTotal;
    if (sidebarSubtotal) sidebarSubtotal.textContent = formattedTotal;
    if (sidebarTotal) sidebarTotal.textContent = formattedTotal;
    
    // Atualizar itens do carrinho
    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div class="item-controls">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart('${item.id}')" class="remove-item">×</button>
            </div>
        </div>
    `).join('');
    
    if (cartItems) cartItems.innerHTML = cartHTML;
    if (sidebarCartItems) sidebarCartItems.innerHTML = cartHTML;
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar) cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
}

function saveCart() {
    localStorage.setItem('aumigos-cart', JSON.stringify(cart));
}

// ===== MODAIS =====
function initializeModals() {
    // Modal de serviços
    document.querySelectorAll('.service-btn').forEach(button => {
        button.addEventListener('click', function() {
            const service = this.dataset.service;
            openServiceModal(service);
        });
    });
    
    // Modal de planos
    document.querySelectorAll('.plan-btn').forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.dataset.plan;
            openPlanModal(plan);
        });
    });
    
    // Modal de PetBox
    document.querySelectorAll('.petbox-btn').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            openPetBoxModal(type);
        });
    });
    
    // Modal de comunidade
    const joinCommunityBtn = document.getElementById('joinCommunityBtn');
    if (joinCommunityBtn) {
        joinCommunityBtn.addEventListener('click', function() {
            openModal('communityModal');
        });
    }
    
    // Fechar modais
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Fechar modal clicando fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

function openServiceModal(service) {
    const modal = document.getElementById('serviceModal');
    const title = document.getElementById('modalTitle');
    
    if (modal && title) {
        const serviceNames = {
            'consulta': 'Agendar Consulta Veterinária',
            'vacinacao': 'Agendar Vacinação',
            'cirurgia': 'Consultar Cirurgia',
            'banho': 'Agendar Banho e Tosa',
            'hotel': 'Reservar Hotel para Pets',
            'adestramento': 'Iniciar Adestramento'
        };
        
        title.textContent = serviceNames[service] || 'Agendar Serviço';
        openModal('serviceModal');
    }
}

function openPlanModal(plan) {
    const modal = document.getElementById('planModal');
    const title = document.getElementById('planModalTitle');
    const summary = document.getElementById('planSummary');
    const price = document.getElementById('planPrice');
    
    if (modal && title) {
        const planData = {
            'basico': { name: 'Plano Básico', price: '49,00', description: 'Cuidados preventivos essenciais' },
            'completo': { name: 'Plano Completo', price: '89,00', description: 'Proteção completa para seu pet' },
            'premium': { name: 'Plano Premium', price: '149,00', description: 'Máxima proteção e conforto' }
        };
        
        const selectedPlan = planData[plan];
        if (selectedPlan) {
            title.textContent = `Contratar ${selectedPlan.name}`;
            if (summary) summary.textContent = selectedPlan.description;
            if (price) price.textContent = selectedPlan.price;
        }
        
        openModal('planModal');
    }
}

function openPetBoxModal(type) {
    const modal = document.getElementById('petboxModal');
    const title = document.getElementById('petboxModalTitle');
    const summary = document.getElementById('petboxSummary');
    const price = document.getElementById('petboxPrice');
    
    if (modal && title) {
        const petboxData = {
            'caes': { name: 'PetBox para Cães', price: '79,90', description: 'Produtos especiais para cães' },
            'gatos': { name: 'PetBox para Gatos', price: '69,90', description: 'Produtos especiais para gatos' },
            'hamsters': { name: 'PetBox para Hamsters', price: '39,90', description: 'Produtos especiais para hamsters' }
        };
        
        const selectedPetBox = petboxData[type];
        if (selectedPetBox) {
            title.textContent = `Assinar ${selectedPetBox.name}`;
            if (summary) summary.textContent = selectedPetBox.description;
            if (price) price.textContent = selectedPetBox.price;
        }
        
        openModal('petboxModal');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== FORMULÁRIOS =====
function initializeForms() {
    // Formulário de serviços
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleServiceSubmission(this);
        });
    }
    
    // Formulário de planos
    const planForm = document.getElementById('planForm');
    if (planForm) {
        planForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePlanSubmission(this);
        });
    }
    
    // Formulário de PetBox
    const petboxForm = document.getElementById('petboxForm');
    if (petboxForm) {
        petboxForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePetBoxSubmission(this);
        });
    }
    
    // Formulário de cadastro de pets
    const petRegistrationForm = document.getElementById('petRegistrationForm');
    if (petRegistrationForm) {
        petRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePetRegistration(this);
        });
    }
    
    // Formulário de comunidade
    const communityForm = document.getElementById('communityForm');
    if (communityForm) {
        communityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCommunitySubmission(this);
        });
    }
    
    // Checkout forms
    initializeCheckoutForms();
}

function handleServiceSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simular envio
    showLoading(form);
    
    setTimeout(() => {
        hideLoading(form);
        closeModal('serviceModal');
        showNotification('Agendamento realizado com sucesso! Entraremos em contato em breve.', 'success');
        form.reset();
    }, 2000);
}

function handlePlanSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    showLoading(form);
    
    setTimeout(() => {
        hideLoading(form);
        closeModal('planModal');
        showNotification('Plano contratado com sucesso! Você receberá um e-mail com os detalhes.', 'success');
        form.reset();
    }, 2000);
}

function handlePetBoxSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    showLoading(form);
    
    setTimeout(() => {
        hideLoading(form);
        closeModal('petboxModal');
        showNotification('PetBox assinado com sucesso! Sua primeira caixa chegará em breve.', 'success');
        form.reset();
    }, 2000);
}

function handlePetRegistration(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    showLoading(form);
    
    setTimeout(() => {
        hideLoading(form);
        
        // Atualizar modal de sucesso
        const previewPetName = document.getElementById('previewPetName');
        const previewPetType = document.getElementById('previewPetType');
        const previewPetCode = document.getElementById('previewPetCode');
        
        if (previewPetName) previewPetName.textContent = data.petName;
        if (previewPetType) previewPetType.textContent = data.petType;
        if (previewPetCode) previewPetCode.textContent = '#PET' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        openModal('registrationSuccessModal');
        form.reset();
    }, 2000);
}

function handleCommunitySubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    showLoading(form);
    
    setTimeout(() => {
        hideLoading(form);
        closeModal('communityModal');
        showNotification('Bem-vindo à comunidade ConectaPet! Você receberá um e-mail de confirmação.', 'success');
        form.reset();
    }, 2000);
}

// ===== CHECKOUT =====
function initializeCheckoutForms() {
    const nextStepBtns = document.querySelectorAll('.next-step');
    const prevStepBtns = document.querySelectorAll('.prev-step');
    const finalizeOrderBtn = document.getElementById('finalizeOrder');
    
    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            nextStep();
        });
    });
    
    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            prevStep();
        });
    });
    
    if (finalizeOrderBtn) {
        finalizeOrderBtn.addEventListener('click', function() {
            finalizeOrder();
        });
    }
    
    // Payment method change
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updatePaymentDetails(this.value);
        });
    });
}

function nextStep() {
    if (validateCurrentStep()) {
        currentStep++;
        updateCheckoutStep();
    }
}

function prevStep() {
    currentStep--;
    updateCheckoutStep();
}

function updateCheckoutStep() {
    // Atualizar indicadores de step
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Mostrar/ocultar conteúdo dos steps
    document.querySelectorAll('.checkout-step').forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`#step${currentStep}`);
    if (!currentStepElement) return false;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--vermelho-erro)';
            isValid = false;
        } else {
            field.style.borderColor = 'var(--cinza-claro)';
        }
    });
    
    if (!isValid) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
    }
    
    return isValid;
}

function updatePaymentDetails(method) {
    const cardDetails = document.getElementById('cardDetails');
    
    if (method === 'creditCard' || method === 'debitCard') {
        if (cardDetails) cardDetails.style.display = 'block';
    } else {
        if (cardDetails) cardDetails.style.display = 'none';
    }
}

function finalizeOrder() {
    showLoading(document.getElementById('finalizeOrder'));
    
    setTimeout(() => {
        hideLoading(document.getElementById('finalizeOrder'));
        
        // Gerar número do pedido
        const orderNumber = '#' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const orderNumberElement = document.getElementById('orderNumber');
        if (orderNumberElement) {
            orderNumberElement.textContent = orderNumber;
        }
        
        // Limpar carrinho
        cart = [];
        saveCart();
        updateCartDisplay();
        
        openModal('successModal');
    }, 3000);
}

// ===== FILTROS E BUSCA =====
function initializeFilters() {
    // Filtros da loja
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    const typeFilters = document.querySelectorAll('input[name="type"]');
    const priceRange = document.getElementById('priceRange');
    const sortSelect = document.getElementById('sortSelect');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    typeFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            document.getElementById('maxPrice').textContent = 'R$ ' + this.value;
            applyFilters();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    // Filtros da comunidade
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterCommunityContent(this.dataset.category);
        });
    });
}

function applyFilters() {
    const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || 'all';
    const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(cb => cb.value);
    const maxPrice = document.getElementById('priceRange')?.value || 500;
    const sortBy = document.getElementById('sortSelect')?.value || 'name';
    
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        const category = product.dataset.category;
        const type = product.dataset.type;
        const price = parseFloat(product.dataset.price);
        
        let shouldShow = true;
        
        // Filtro de categoria
        if (selectedCategory !== 'all' && category !== selectedCategory) {
            shouldShow = false;
        }
        
        // Filtro de tipo
        if (selectedTypes.length > 0 && !selectedTypes.includes(type)) {
            shouldShow = false;
        }
        
        // Filtro de preço
        if (price > maxPrice) {
            shouldShow = false;
        }
        
        if (shouldShow) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Atualizar contador de resultados
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${visibleCount} produtos encontrados`;
    }
    
    // Aplicar ordenação
    sortProducts(sortBy);
}

function sortProducts(sortBy) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const products = Array.from(productsGrid.querySelectorAll('.product-card:not([style*="display: none"])'));
    
    products.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            case 'price-high':
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            case 'name':
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            default:
                return 0;
        }
    });
    
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
}

function clearFilters() {
    // Resetar filtros
    document.querySelector('input[name="category"][value="all"]').checked = true;
    document.querySelectorAll('input[name="type"]').forEach(cb => cb.checked = false);
    
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = 500;
        document.getElementById('maxPrice').textContent = 'R$ 500';
    }
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = 'name';
    }
    
    applyFilters();
}

function filterCommunityContent(category) {
    const topics = document.querySelectorAll('.topic-card');
    
    topics.forEach(topic => {
        if (category === 'all' || topic.dataset.category === category) {
            topic.style.display = 'block';
        } else {
            topic.style.display = 'none';
        }
    });
}

// ===== TABS =====
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId, this);
        });
    });
}

function switchTab(tabId, button) {
    // Remover classe active de todos os botões e conteúdos
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adicionar classe active ao botão e conteúdo selecionados
    button.classList.add('active');
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

// ===== FAQ =====
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('i');
            
            // Toggle answer
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            } else {
                // Fechar outras respostas
                document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
                document.querySelectorAll('.faq-question i').forEach(i => i.style.transform = 'rotate(0deg)');
                
                answer.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// ===== ANIMAÇÕES =====
function initializeAnimations() {
    // Intersection Observer para animações de scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos com classes de animação
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
    
    // Animação de números (contadores)
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const suffix = counter.textContent.replace(/\d/g, '');
            counter.textContent = Math.floor(current) + suffix;
        }, 16);
    });
}

// ===== UTILITÁRIOS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos inline se não existirem
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--verde-sucesso)' : type === 'error' ? 'var(--vermelho-erro)' : 'var(--azul-forte)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-heavy);
        z-index: 1003;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
        
        const originalText = element.textContent;
        element.dataset.originalText = originalText;
        element.innerHTML = '<div class="spinner"></div>';
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
        element.textContent = element.dataset.originalText || 'Enviar';
    }
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    input.value = value;
}

function formatCPF(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

// Aplicar formatação automática
document.addEventListener('input', function(e) {
    if (e.target.type === 'tel') {
        formatPhone(e.target);
    }
    
    if (e.target.name === 'cpf' || e.target.name === 'ownerCpf') {
        formatCPF(e.target);
    }
});

// ===== EVENTOS GLOBAIS =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--branco)';
        header.style.backdropFilter = 'none';
    }
});

// Prevenir envio de formulários vazios
document.addEventListener('submit', function(e) {
    const form = e.target;
    const requiredFields = form.querySelectorAll('[required]');
    let hasEmptyFields = false;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            hasEmptyFields = true;
            field.style.borderColor = 'var(--vermelho-erro)';
        } else {
            field.style.borderColor = 'var(--cinza-claro)';
        }
    });
    
    if (hasEmptyFields) {
        e.preventDefault();
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
    }
});

// Funções globais para uso em HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openModal = openModal;
window.closeModal = closeModal;
window.showNotification = showNotification;

