// Global Variables
let formData = {
    operatorName: '',
    customerName: '',
    phoneNumber: '',
    emailId: '',
    aadharNumber: '',
    dob: '',
    pincode: '',
    aadharPhoto: null,
    planSpeed: '',
    planValidity: '',
    iptvApp: '',
    iptvCategory: '',
    imageUrl: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 1.5 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.getElementById('mainContainer').style.opacity = '1';
            }, 500);
        }
    }, 1500);

    // Set today as max date for DOB
    const today = new Date().toISOString().split('T')[0];
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        dobInput.max = today;
    }

    // Initialize form validation
    initializeValidation();
});

// Form Navigation
function nextStep(next) {
    const currentStep = document.querySelector('.form-step.active');
    const nextStep = document.getElementById('step' + next);
    
    if (!currentStep || !nextStep) return;
    
    // Validate current step
    if (!validateStep(currentStep.id.replace('step', ''))) {
        showError('Please fill all required fields');
        return;
    }
    
    // Animation
    currentStep.classList.remove('active');
    currentStep.style.animation = 'slideOutLeft 0.5s ease';
    
    setTimeout(() => {
        currentStep.style.display = 'none';
        currentStep.style.animation = '';
        
        nextStep.style.display = 'block';
        setTimeout(() => {
            nextStep.classList.add('active');
            updateProgressBar(next);
        }, 10);
    }, 500);
}

function prevStep(prev) {
    const currentStep = document.querySelector('.form-step.active');
    const prevStep = document.getElementById('step' + prev);
    
    if (!currentStep || !prevStep) return;
    
    // Animation
    currentStep.classList.remove('active');
    currentStep.style.animation = 'slideOutRight 0.5s ease';
    
    setTimeout(() => {
        currentStep.style.display = 'none';
        currentStep.style.animation = '';
        
        prevStep.style.display = 'block';
        setTimeout(() => {
            prevStep.classList.add('active');
            updateProgressBar(prev);
        }, 10);
    }, 500);
}

// Update Progress Bar
function updateProgressBar(step) {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = (step - 1) * 25;
        progressBar.style.width = `${progress}%`;
    }
    
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
        if (parseInt(s.dataset.step) <= step) {
            s.classList.add('active');
        }
    });
}

// Form Validation
function initializeValidation() {
    // Phone number validation
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    }
    
    // Aadhar validation
    const aadharInput = document.getElementById('aadharNumber');
    if (aadharInput) {
        aadharInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 12);
        });
    }
    
    // Pincode validation
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 6);
        });
    }
    
    // Email validation
    const emailInput = document.getElementById('emailId');
    if (emailInput) {
        emailInput.addEventListener('blur', function(e) {
            const email = this.value;
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('Please enter valid email ID');
            }
        });
    }
}

function validateStep(step) {
    switch(step) {
        case '1':
            const opName = document.getElementById('operatorName')?.value || '';
            const custName = document.getElementById('customerName')?.value || '';
            const phone = document.getElementById('phoneNumber')?.value || '';
            const email = document.getElementById('emailId')?.value || '';
            
            if (!opName.trim() || !custName.trim() || !phone.trim() || !email.trim()) {
                showError('All fields are required');
                return false;
            }
            if (phone.length !== 10) {
                showError('Phone number must be 10 digits');
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('Please enter valid email');
                return false;
            }
            
            // Store data
            formData.operatorName = opName;
            formData.customerName = custName;
            formData.phoneNumber = phone;
            formData.emailId = email;
            return true;
            
        case '2':
            const aadhar = document.getElementById('aadharNumber')?.value || '';
            const dob = document.getElementById('dob')?.value || '';
            const pincode = document.getElementById('pincode')?.value || '';
            
            if (!aadhar.trim() || !dob || !pincode.trim()) {
                showError('All fields are required');
                return false;
            }
            if (aadhar.length !== 12) {
                showError('Aadhar number must be 12 digits');
                return false;
            }
            if (pincode.length !== 6) {
                showError('Pincode must be 6 digits');
                return false;
            }
            
            formData.aadharNumber = aadhar;
            formData.dob = dob;
            formData.pincode = pincode;
            return true;
            
        case '3':
            if (!formData.planSpeed || !formData.planValidity) {
                showError('Please select speed and validity plan');
                return false;
            }
            return true;
            
        case '4':
            if (!formData.iptvApp) {
                showError('Please select IPTV app');
                return false;
            }
            if (formData.iptvApp === 'onyxplay' && !formData.iptvCategory) {
                showError('Please select language');
                return false;
            }
            if (formData.iptvApp === 'ziggtv' && !formData.iptvCategory) {
                showError('Please select package');
                return false;
            }
            return true;
    }
    return true;
}

// Plan Selection
function selectPlan(type, element) {
    const cards = document.querySelectorAll(`#${type}Plans .plan-card`);
    cards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    if (type === 'speed') {
        formData.planSpeed = element.dataset.value + ' Mbps';
    } else {
        formData.planValidity = element.dataset.value + ' Month' + (element.dataset.value > 1 ? 's' : '');
    }
    
    // Add animation
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = '';
    }, 300);
}

// IPTV Selection
function selectIPTVApp(app) {
    const cards = document.querySelectorAll('.iptv-card');
    cards.forEach(card => card.classList.remove('selected'));
    event.target.closest('.iptv-card').classList.add('selected');
    
    formData.iptvApp = app;
    
    // Show respective options
    if (app === 'onyxplay') {
        document.getElementById('languageSection').style.display = 'block';
        document.getElementById('packageSection').style.display = 'none';
        formData.iptvCategory = '';
    } else {
        document.getElementById('packageSection').style.display = 'block';
        document.getElementById('languageSection').style.display = 'none';
        formData.iptvCategory = '';
    }
}

function selectLanguage(element) {
    const langs = document.querySelectorAll('.lang-card');
    langs.forEach(lang => lang.classList.remove('selected'));
    element.classList.add('selected');
    formData.iptvCategory = element.textContent;
}

function selectPackage(element) {
    const packages = document.querySelectorAll('.package-card');
    packages.forEach(pkg => pkg.classList.remove('selected'));
    element.classList.add('selected');
    formData.iptvCategory = element.textContent;
}

// Image Upload - FIXED
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
        showError('Please upload only image files (JPG, PNG, etc.)');
        return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Aadhar Preview">`;
        }
        formData.aadharPhoto = file;
        formData.imageUrl = e.target.result;
    };
    
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        showError('Error reading image file. Please try again.');
    };
    
    reader.readAsDataURL(file);
}

// Submit Form
async function submitForm() {
    // Validate all steps
    if (!validateStep(4)) return;
    
    // Show loading
    const submitBtn = document.querySelector('.btn-submit');
    if (!submitBtn) return;
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // Get area name from pincode
        const areaName = await getAreaFromPincode(formData.pincode);
        
        // Prepare data for submission
        const submissionData = {
            timestamp: new Date().toISOString(),
            operatorName: formData.operatorName,
            customerName: formData.customerName,
            phoneNumber: formData.phoneNumber,
            emailId: formData.emailId,
            aadharNumber: formData.aadharNumber,
            planSpeed: formData.planSpeed,
            planValidity: formData.planValidity,
            iptvApp: formData.iptvApp,
            areaName: areaName,
            dob: formData.dob,
            languageSelection: formData.iptvApp === 'onyxplay' ? formData.iptvCategory : '',
            iptvPackage: formData.iptvApp === 'ziggtv' ? formData.iptvCategory : '',
            imageData: formData.imageUrl || ''
        };
        
        // IMPORTANT: Replace with your Apps Script URL after deployment
        const scriptUrl = 'YOUR_APPS_SCRIPT_URL_HERE';
        
        // Send to Google Apps Script
        if (scriptUrl && scriptUrl !== 'YOUR_APPS_SCRIPT_URL_HERE') {
            const response = await fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } else {
            // For testing without Apps Script
            console.log('Form data:', submissionData);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        showSuccess();
        
    } catch (error) {
        console.error('Error:', error);
        showError('Submission error. Please try again later.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Get Area from Pincode
async function getAreaFromPincode(pincode) {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice[0]) {
            return data[0].PostOffice[0].District || 'Area not found';
        }
    } catch (error) {
        console.error('Error fetching area:', error);
    }
    return 'Area not found';
}

// Show Success Message
function showSuccess() {
    const formContainer = document.querySelector('.form-container');
    const successMessage = document.getElementById('successMessage');
    
    if (formContainer) formContainer.style.display = 'none';
    if (successMessage) successMessage.style.display = 'block';
    
    // Send Telegram notification
    sendTelegramNotification();
}

// Send Telegram Notification
async function sendTelegramNotification() {
    const message = `🚀 *New Connection Request*
    
👤 *Customer:* ${formData.customerName}
📞 *Phone:* ${formData.phoneNumber}
📧 *Email:* ${formData.emailId}
🆔 *Aadhar:* ${formData.aadharNumber}
⚡ *Speed:* ${formData.planSpeed}
📅 *Validity:* ${formData.planValidity}
📺 *IPTV:* ${formData.iptvApp} - ${formData.iptvCategory}
📍 *Pincode:* ${formData.pincode}

✅ Submitted: ${new Date().toLocaleString()}`;
    
    const chatIds = ["6582960717", "2028547811", "1492277630"];
    const token = "8428090705:AAGyI-23H2czhusnbZ6nNP324_DdqUU-DRI";
    
    for (const chatId of chatIds) {
        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
        } catch (error) {
            console.error('Telegram error:', error);
        }
    }
}

// Reset Form
function resetForm() {
    formData = {
        operatorName: '',
        customerName: '',
        phoneNumber: '',
        emailId: '',
        aadharNumber: '',
        dob: '',
        pincode: '',
        aadharPhoto: null,
        planSpeed: '',
        planValidity: '',
        iptvApp: '',
        iptvCategory: '',
        imageUrl: ''
    };
    
    // Reset form fields
    const forms = ['step1', 'step2', 'step3', 'step4'];
    forms.forEach(step => {
        const form = document.getElementById(step);
        if (form) form.reset();
    });
    
    // Reset selections
    document.querySelectorAll('.plan-card, .iptv-card, .lang-card, .package-card').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Reset image preview
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.innerHTML = '';
    
    // Hide sections
    const languageSection = document.getElementById('languageSection');
    const packageSection = document.getElementById('packageSection');
    if (languageSection) languageSection.style.display = 'none';
    if (packageSection) packageSection.style.display = 'none';
    
    // Show form, hide success
    const successMessage = document.getElementById('successMessage');
    const formContainer = document.querySelector('.form-container');
    if (successMessage) successMessage.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';
    
    // Go to step 1
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    const step1 = document.getElementById('step1');
    if (step1) {
        step1.classList.add('active');
        step1.style.display = 'block';
    }
    
    updateProgressBar(1);
}

// Error Handling
function showError(message) {
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Create error element
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <i class="fas fa-times" onclick="this.parentElement.remove()"></i>
    `;
    
    document.body.appendChild(errorEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorEl.parentNode) {
            errorEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => errorEl.remove(), 300);
        }
    }, 5000);
}
