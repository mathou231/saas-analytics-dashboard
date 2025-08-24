// Configuration globale
const config = {
    updateInterval: 3000, // 3 secondes
    animationDuration: 1000,
    colors: {
        primary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        gradient: {
            blue: ['#667eea', '#764ba2'],
            green: ['#10b981', '#059669'],
            orange: ['#f59e0b', '#d97706'],
            red: ['#ef4444', '#dc2626']
        }
    }
};

// Données de base
let dashboardData = {
    mrr: 42350,
    customers: 1247,
    churnRate: 2.1,
    tickets: 23,
    serverMetrics: {
        cpu: 45,
        memory: 67,
        storage: 34,
        uptime: 99.98
    },
    revenueHistory: [],
    customerHistory: []
};

// Variables globales pour les graphiques
let revenueChart;
let customerChart;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupRealTimeUpdates();
    initializeCharts();
    startAnimations();
});

// Initialisation du dashboard
function initializeDashboard() {
    console.log('🚀 Initialisation du Dashboard SaaS Analytics Pro...');
    
    // Générer les données historiques
    generateHistoricalData();
    
    // Mise à jour initiale des KPI
    updateKPIs();
    
    // Mise à jour des métriques serveur
    updateServerMetrics();
    
    // Configuration des événements
    setupEventListeners();
}

// Génération des données historiques
function generateHistoricalData() {
    const now = new Date();
    
    // Données de revenus (30 derniers jours)
    dashboardData.revenueHistory = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const baseRevenue = 40000;
        const variation = Math.sin(i / 5) * 5000 + Math.random() * 3000;
        dashboardData.revenueHistory.push({
            date: date,
            value: Math.max(baseRevenue + variation, 35000)
        });
    }
    
    // Données clients (30 derniers jours)
    dashboardData.customerHistory = [];
    let baseCustomers = 1200;
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const growth = Math.random() * 5 + 1; // Croissance quotidienne 1-6
        baseCustomers += growth;
        dashboardData.customerHistory.push({
            date: date,
            value: Math.floor(baseCustomers)
        });
    }
}

// Mise à jour des KPI en temps réel
function updateKPIs() {
    // MRR avec variation réaliste
    const mrrVariation = (Math.random() - 0.5) * 1000;
    dashboardData.mrr += mrrVariation;
    animateCounter('mrr', dashboardData.mrr, '€');
    
    // Clients actifs
    const customerVariation = Math.floor((Math.random() - 0.3) * 5); // Tendance positive
    dashboardData.customers = Math.max(dashboardData.customers + customerVariation, 1000);
    animateCounter('customers', dashboardData.customers);
    
    // Taux de churn
    const churnVariation = (Math.random() - 0.5) * 0.2;
    dashboardData.churnRate = Math.max(0.5, Math.min(5.0, dashboardData.churnRate + churnVariation));
    animateCounter('churn', dashboardData.churnRate, '', '%');
    
    // Tickets support
    const ticketVariation = Math.floor((Math.random() - 0.6) * 3); // Tendance à diminuer
    dashboardData.tickets = Math.max(0, dashboardData.tickets + ticketVariation);
    animateCounter('tickets', dashboardData.tickets);
}

// Animation des compteurs
function animateCounter(elementId, targetValue, prefix = '', suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
    const duration = config.animationDuration;
    const startTime = Date.now();
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function pour une animation plus fluide
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (targetValue - startValue) * easeOutCubic;
        
        let displayValue;
        if (suffix === '%') {
            displayValue = currentValue.toFixed(1);
        } else if (prefix === '€') {
            displayValue = Math.floor(currentValue).toLocaleString();
        } else {
            displayValue = Math.floor(currentValue).toLocaleString();
        }
        
        element.textContent = prefix + displayValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// Mise à jour des métriques serveur
function updateServerMetrics() {
    // CPU
    const cpuVariation = (Math.random() - 0.5) * 10;
    dashboardData.serverMetrics.cpu = Math.max(20, Math.min(90, dashboardData.serverMetrics.cpu + cpuVariation));
    updateProgressBar('cpu-usage', 'cpu-value', dashboardData.serverMetrics.cpu);
    
    // Mémoire
    const memoryVariation = (Math.random() - 0.5) * 8;
    dashboardData.serverMetrics.memory = Math.max(30, Math.min(85, dashboardData.serverMetrics.memory + memoryVariation));
    updateProgressBar('memory-usage', 'memory-value', dashboardData.serverMetrics.memory);
    
    // Stockage (augmente lentement)
    const storageVariation = Math.random() * 0.5;
    dashboardData.serverMetrics.storage = Math.min(95, dashboardData.serverMetrics.storage + storageVariation);
    updateProgressBar('storage-usage', 'storage-value', dashboardData.serverMetrics.storage);
    
    // Uptime
    const uptimeVariation = (Math.random() - 0.99) * 0.01; // Très stable
    dashboardData.serverMetrics.uptime = Math.max(99.5, Math.min(100, dashboardData.serverMetrics.uptime + uptimeVariation));
    document.getElementById('uptime').textContent = dashboardData.serverMetrics.uptime.toFixed(2) + '%';
}

// Mise à jour des barres de progression
function updateProgressBar(barId, valueId, percentage) {
    const bar = document.getElementById(barId);
    const value = document.getElementById(valueId);
    
    if (bar) {
        bar.style.width = percentage + '%';
    }
    if (value) {
        value.textContent = Math.round(percentage) + '%';
    }
}

// Initialisation des graphiques
function initializeCharts() {
    // Configuration commune
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = 'Inter';
    Chart.defaults.plugins.legend.display = false;
    
    // Graphique des revenus
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: dashboardData.revenueHistory.map(item => 
                item.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
            ),
            datasets: [{
                label: 'Revenus (€)',
                data: dashboardData.revenueHistory.map(item => item.value),
                borderColor: config.colors.success,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: config.colors.success,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    backgroundColor: '#1e2139',
                    titleColor: '#ffffff',
                    bodyColor: '#94a3b8',
                    borderColor: '#2d3748',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Revenus: €' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(45, 55, 72, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(45, 55, 72, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '€' + (value / 1000).toFixed(0) + 'k';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
    
    // Graphique des clients
    const customerCtx = document.getElementById('customerChart').getContext('2d');
    customerChart = new Chart(customerCtx, {
        type: 'doughnut',
        data: {
            labels: ['Clients Actifs', 'Clients Inactifs', 'Nouveaux Clients'],
            datasets: [{
                data: [dashboardData.customers, 156, 91],
                backgroundColor: [
                    config.colors.primary,
                    config.colors.warning,
                    config.colors.success
                ],
                borderColor: '#1e2139',
                borderWidth: 3,
                hoverBorderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                tooltip: {
                    backgroundColor: '#1e2139',
                    titleColor: '#ffffff',
                    bodyColor: '#94a3b8',
                    borderColor: '#2d3748',
                    borderWidth: 1,
                    cornerRadius: 8
                }
            }
        }
    });
}

// Mise à jour des graphiques
function updateCharts() {
    // Ajouter un nouveau point de données pour les revenus
    const now = new Date();
    const newRevenueValue = dashboardData.mrr + (Math.random() - 0.5) * 2000;
    
    // Supprimer le premier point et ajouter un nouveau
    dashboardData.revenueHistory.shift();
    dashboardData.revenueHistory.push({
        date: now,
        value: newRevenueValue
    });
    
    // Mettre à jour le graphique des revenus
    if (revenueChart) {
        revenueChart.data.labels = dashboardData.revenueHistory.map(item => 
            item.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
        );
        revenueChart.data.datasets[0].data = dashboardData.revenueHistory.map(item => item.value);
        revenueChart.update('none');
    }
    
    // Mettre à jour le graphique des clients
    if (customerChart) {
        customerChart.data.datasets[0].data = [
            dashboardData.customers,
            Math.floor(dashboardData.customers * 0.12),
            Math.floor(dashboardData.customers * 0.07)
        ];
        customerChart.update('none');
    }
}

// Configuration des mises à jour en temps réel
function setupRealTimeUpdates() {
    // Mise à jour des KPI toutes les 3 secondes
    setInterval(() => {
        updateKPIs();
    }, config.updateInterval);
    
    // Mise à jour des métriques serveur toutes les 2 secondes
    setInterval(() => {
        updateServerMetrics();
    }, 2000);
    
    // Mise à jour des graphiques toutes les 10 secondes
    setInterval(() => {
        updateCharts();
    }, 10000);
    
    // Simulation d'activité en temps réel
    setInterval(() => {
        simulateActivity();
    }, 8000);
}

// Simulation d'activité
function simulateActivity() {
    const activities = [
        {
            icon: 'fas fa-user-plus',
            iconClass: 'new-customer',
            title: 'Nouveau client inscrit',
            description: getRandomCompany() + ' - Plan Pro',
            time: 'Il y a ' + Math.floor(Math.random() * 10 + 1) + ' minutes'
        },
        {
            icon: 'fas fa-credit-card',
            iconClass: 'payment',
            title: 'Paiement reçu',
            description: '€' + (Math.floor(Math.random() * 500) + 99) + ' - ' + getRandomCompany(),
            time: 'Il y a ' + Math.floor(Math.random() * 15 + 1) + ' minutes'
        },
        {
            icon: 'fas fa-ticket-alt',
            iconClass: 'support',
            title: 'Ticket résolu',
            description: '#' + Math.floor(Math.random() * 9000 + 1000) + ' - ' + getRandomIssue(),
            time: 'Il y a ' + Math.floor(Math.random() * 30 + 1) + ' minutes'
        }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    addActivityToFeed(randomActivity);
}

// Ajouter une activité au feed
function addActivityToFeed(activity) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Créer le nouvel élément
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.opacity = '0';
    activityItem.style.transform = 'translateY(-20px)';
    
    activityItem.innerHTML = `
        <div class="activity-icon ${activity.iconClass}">
            <i class="${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <p><strong>${activity.title}</strong></p>
            <span>${activity.description}</span>
            <small>${activity.time}</small>
        </div>
    `;
    
    // Insérer au début de la liste
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Animation d'apparition
    setTimeout(() => {
        activityItem.style.transition = 'all 0.5s ease';
        activityItem.style.opacity = '1';
        activityItem.style.transform = 'translateY(0)';
    }, 100);
    
    // Limiter à 3 activités visibles
    const items = activityList.querySelectorAll('.activity-item');
    if (items.length > 3) {
        items[items.length - 1].remove();
    }
}

// Données pour la simulation
function getRandomCompany() {
    const companies = ['TechCorp', 'StartupXYZ', 'InnovateLab', 'DataPro', 'CloudTech', 'DevStudio', 'SmartSoft', 'NextGen'];
    return companies[Math.floor(Math.random() * companies.length)];
}

function getRandomIssue() {
    const issues = ['Bug d\'authentification', 'Problème de synchronisation', 'Erreur d\'API', 'Interface utilisateur', 'Performance lente', 'Problème de paiement'];
    return issues[Math.floor(Math.random() * issues.length)];
}

// Configuration des événements
function setupEventListeners() {
    // Boutons de contrôle des graphiques
    const chartButtons = document.querySelectorAll('.chart-controls button');
    chartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            chartButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Ici on pourrait implémenter la logique de filtrage par période
            console.log('Période sélectionnée:', this.textContent);
        });
    });
    
    // Navigation sidebar (simulation)
    const navItems = document.querySelectorAll('nav li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Animations au démarrage
function startAnimations() {
    // Animation des cartes KPI
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animationDelay = (index * 0.1) + 's';
        }, index * 100);
    });
    
    // Animation initiale des barres de progression
    setTimeout(() => {
        updateProgressBar('cpu-usage', 'cpu-value', dashboardData.serverMetrics.cpu);
        updateProgressBar('memory-usage', 'memory-value', dashboardData.serverMetrics.memory);
        updateProgressBar('storage-usage', 'storage-value', dashboardData.serverMetrics.storage);
    }, 1000);
}

// Fonction utilitaire pour générer des couleurs aléatoires
function getRandomColor() {
    const colors = [config.colors.primary, config.colors.success, config.colors.warning, config.colors.danger];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Export pour debugging (optionnel)
window.dashboardDebug = {
    data: dashboardData,
    updateKPIs: updateKPIs,
    updateCharts: updateCharts,
    config: config
};

console.log('✅ Dashboard SaaS Analytics Pro initialisé avec succès!');
console.log('🔧 Utilisez window.dashboardDebug pour accéder aux fonctions de debug');
