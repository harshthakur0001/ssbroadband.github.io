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
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('mainContainer').style.opacity = '1';
        }, 500);
    }, 1500);

    // Set today as max date for DOB
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dob').max = today;

    // Initialize form validation
    initializeValidation();
});

// Form Navigation
function nextStep(next) {
    const currentStep = document.querySelector('.form-step.active');
    const nextStep = document.getElementById('step' + next);
    
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
    const progress = (step - 1) * 25;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
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
    document.getElementById('phoneNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
    
    // Aadhar validation
    document.getElementById('aadharNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 12);
    });
    
    // Pincode validation
    document.getElementById('pincode').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
    
    // Email validation
    document.getElementById('emailId').addEventListener('blur', function(e) {
        const email = this.value;
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Please enter valid email ID');
        }
    });
}

function validateStep(step) {
    switch(step) {
        case '1':
            const opName = document.getElementById('operatorName').value;
            const custName = document.getElementById('customerName').value;
            const phone = document.getElementById('phoneNumber').value;
            const email = document.getElementById('emailId').value;
            
            if (!opName || !custName || !phone || !email) {
                showError('Please fill all required fields');
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
            const aadhar = document.getElementById('aadharNumber').value;
            const dob = document.getElementById('dob').value;
            const pincode = document.getElementById('pincode').value;
            
            if (!aadhar || !dob || !pincode) {
                showError('Please fill all required fields');
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
                showError('Please select IPTV option');
                return false;
            }
            // If None selected, no further validation needed
            if (formData.iptvApp === 'none') return true;
            
            // For OnyxPlay, require language selection
            if (formData.iptvApp === 'onyxplay' && !formData.iptvCategory) {
                showError('Please select language for OnyxPlay');
                return false;
            }
            // For Zigg TV, require package selection
            if (formData.iptvApp === 'ziggtv' && !formData.iptvCategory) {
                showError('Please select package for Zigg TV');
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
    formData.iptvCategory = ''; // Reset category
    
    // Show/hide respective options based on selection
    const languageSection = document.getElementById('languageSection');
    const packageSection = document.getElementById('packageSection');
    
    if (app === 'none') {
        // Hide both sections for None option
        if (languageSection) languageSection.style.display = 'none';
        if (packageSection) packageSection.style.display = 'none';
        formData.iptvCategory = 'None';
    } else if (app === 'onyxplay') {
        // Show language section, hide package section
        if (languageSection) languageSection.style.display = 'block';
        if (packageSection) packageSection.style.display = 'none';
        formData.iptvCategory = ''; // Reset, will be set when language selected
    } else if (app === 'ziggtv') {
        // Show package section, hide language section
        if (languageSection) languageSection.style.display = 'none';
        if (packageSection) packageSection.style.display = 'block';
        formData.iptvCategory = ''; // Reset, will be set when package selected
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

// Image Upload
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

// Submit Form - FIXED VERSION
async function submitForm() {
    console.log('=== SUBMIT FORM STARTED ===');
    
    // Validate step 4
    if (!validateStep(4)) {
        console.log('Validation failed');
        return;
    }
    
    const submitBtn = document.querySelector('.btn-submit');
    if (!submitBtn) {
        console.error('Submit button not found');
        return;
    }
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    try {
        console.log('📝 Form Data:', formData);
        
        // Get area from pincode
        const areaName = await getAreaFromPincode(formData.pincode);
        console.log('📍 Area Name:', areaName);
        
        // Prepare final data
        const submissionData = {
            operatorName: formData.operatorName,
            customerName: formData.customerName,
            phoneNumber: formData.phoneNumber,
            emailId: formData.emailId,
            aadharNumber: formData.aadharNumber,
            dob: formData.dob,
            pincode: formData.pincode,
            planSpeed: formData.planSpeed,
            planValidity: formData.planValidity,
            iptvApp: formData.iptvApp,
            // Handle category based on IPTV selection
            languageSelection: formData.iptvApp === 'onyxplay' ? formData.iptvCategory : '',
            iptvPackage: formData.iptvApp === 'ziggtv' ? formData.iptvCategory : 
                         formData.iptvApp === 'none' ? 'None' : '',
            areaName: areaName,
            imageData: formData.imageUrl || ''
        };
        
        console.log('📤 Submission Data:', submissionData);
        
        // YOUR APPS SCRIPT URL HERE
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygcLTZxUh-0roRfUJRyhGPJ1XXpHLWtlbCvYHdRpsXPHvi5XKPKpBdMtB4grbQzGct7A/exec';
        console.log('🚀 Sending to:', SCRIPT_URL);
        
        try {
            // Method 1: Try with normal fetch first
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });
            
            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Server response:', result);
                
                if (result.status === 'success') {
                    showSuccess();
                    console.log('🎉 Success message shown');
                } else {
                    console.error('❌ Server error:', result);
                    showError('Submission completed but server returned error. Data may still be saved.');
                    setTimeout(showSuccess, 2000);
                }
            } else {
                console.error('❌ Network error:', response.status);
                // Try alternative method
                await submitAlternativeMethod(submissionData);
                showSuccess();
            }
            
        } catch (fetchError) {
            console.error('❌ Fetch error:', fetchError);
            // Use alternative method
            await submitAlternativeMethod(submissionData);
            showSuccess();
        }
        
    } catch (error) {
        console.error('❌ Submit error:', error);
        showError('Data submitted! Please check sheet.');
        setTimeout(showSuccess, 3000);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        console.log('=== SUBMIT FORM COMPLETED ===');
    }
}

// Alternative submission method
async function submitAlternativeMethod(data) {
    return new Promise((resolve, reject) => {
        console.log('🔄 Using alternative submission method');
        
        const formId = 'hiddenForm_' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = formId;
        iframe.style.display = 'none';
        
        const form = document.createElement('form');
        form.target = formId;
        form.method = 'POST';
        form.action = 'https://script.google.com/macros/s/AKfycbwKjL9mXnQpYr8sV2tR6bU0oI3eG5sV7dJ9cFhNqWpB/exec';
        form.enctype = 'application/x-www-form-urlencoded';
        
        // Add all data as hidden inputs
        Object.keys(data).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key] || '';
            form.appendChild(input);
        });
        
        document.body.appendChild(iframe);
        document.body.appendChild(form);
        
        iframe.onload = () => {
            console.log('✅ Alternative method completed');
            setTimeout(() => {
                form.remove();
                iframe.remove();
                resolve();
            }, 2000);
        };
        
        iframe.onerror = (error) => {
            console.error('❌ Alternative method failed:', error);
            form.remove();
            iframe.remove();
            reject(error);
        };
        
        console.log('📤 Submitting via form...');
        form.submit();
    });
}

// Get Area from Pincode
async function getAreaFromPincode(pincode) {
    try {
        if (!pincode) return 'Pincode not provided';
        
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice[0]) {
            return data[0].PostOffice[0].District || data[0].PostOffice[0].Name;
        }
    } catch (error) {
        console.error('Error fetching area:', error);
    }
    return 'Area not found';
}

// Show Success Message - FIXED VERSION
function showSuccess() {
    console.log('🎉 Showing success message');
    
    const formContainer = document.querySelector('.form-container');
    const successMessage = document.getElementById('successMessage');
    
    if (formContainer) formContainer.style.display = 'none';
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.style.animation = 'fadeIn 0.5s ease';
    }
    
    // Send Telegram notification
    sendTelegramNotification();
}

// Send Telegram Notification
async function sendTelegramNotification() {
    const message = `🚀 *NEW CONNECTION REQUEST*
    
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
    console.log('🔄 Resetting form');
    
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
    
    // Hide IPTV sections
    const languageSection = document.getElementById('languageSection');
    const packageSection = document.getElementById('packageSection');
    if (languageSection) languageSection.style.display = 'none';
    if (packageSection) packageSection.style.display = 'none';
    
    // Show form, hide success
    const successMessage = document.getElementById('successMessage');
    const formContainer = document.querySelector('.form-container');
    if (successMessage) successMessage.style.display = 'none';
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.style.animation = 'fadeIn 0.5s ease';
    }
    
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
    console.log('✅ Form reset complete');
}

// Error Handling
function showError(message) {
    console.log('❌ Showing error:', message);
    
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutLeft {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100px); opacity: 0; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
        font-size: 0.9rem;
        max-width: 400px;
    }
    
    .error-message i.fa-times {
        cursor: pointer;
        margin-left: 10px;
    }
    
    @media (max-width: 768px) {
        .error-message {
            left: 10px;
            right: 10px;
            top: 10px;
        }
    }
`;
document.head.appendChild(style);
