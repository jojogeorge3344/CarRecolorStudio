// ─────────────────────────────────────────────
//  State
// ─────────────────────────────────────────────
const state = {
    cars: [],
    colors: [],
    filteredColors: [],
    selectedCar: null,
    selectedInfoCar: null,
    selectedColor: null,
    recent: [],
    carDetailsByCar: {},
    draftSections: [],
    paint: {
        tool: 'brush',
        size: 12,
        color: '#FF2800',
        isDrawing: false,
        lastX: 0,
        lastY: 0
    },
    users: [],
    filteredUsers: [],
    selectedUser: null,
    userSortDirection: 'none',
    cinematic: {
        mode: 'pulse',
        color: '#FF2800',
        rotation: 0
    }
};

const MAX_RECENT = 20;

let appInitialized = false;
let engineAudioContext = null;
let engineOscillator = null;
let engineGain = null;


// ─────────────────────────────────────────────
//  Element references
// ─────────────────────────────────────────────
const el = {
    appShell: document.getElementById('appShell'),
    loginScreen: document.getElementById('loginScreen'),
    loginForm: document.getElementById('loginForm'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    loginSubmitBtn: document.getElementById('loginSubmitBtn'),
    loginError: document.getElementById('loginError'),
    logoutBtn: document.getElementById('logoutBtn'),
    recolorModuleBtn: document.getElementById('recolorModuleBtn'),
    carInfoModuleBtn: document.getElementById('carInfoModuleBtn'),
    vehicleManagementModuleBtn: document.getElementById('vehicleManagementModuleBtn'),
    recolorModule: document.getElementById('recolorModule'),
    carInfoModule: document.getElementById('carInfoModule'),
    vehicleManagementModule: document.getElementById('vehicleManagementModule'),
    carBrandSelect: document.getElementById('carBrandSelect'),
    carSelect: document.getElementById('carSelect'),
    carInfo: document.getElementById('carInfo'),
    colorList: document.getElementById('colorList'),
    carBrandBadge: document.getElementById('carBrandBadge'),
    colorSearch: document.getElementById('colorSearch'),
    customHex: document.getElementById('customHex'),
    customHexPicker: document.getElementById('customHexPicker'),
    categoryFilter: document.getElementById('categoryFilter'),
    colorList: document.getElementById('colorList'),
    recentColors: document.getElementById('recentColors'),
    selectedCarLabel: document.getElementById('selectedCarLabel'),
    selectedColorLabel: document.getElementById('selectedColorLabel'),
    originalImage: document.getElementById('originalImage'),
    recoloredImage: document.getElementById('recoloredImage'),
    sliderOriginal: document.getElementById('sliderOriginal'),
    sliderRecolored: document.getElementById('sliderRecolored'),
    sliderOverlay: document.getElementById('sliderOverlay'),
    sliderDivider: document.getElementById('sliderDivider'),
    compareSlider: document.getElementById('compareSlider'),
    zoomRange: document.getElementById('zoomRange'),
    viewer: document.getElementById('viewer'),
    downloadRecoloredBtn: document.getElementById('downloadRecoloredBtn'),
    paintBrushBtn: document.getElementById('paintBrushBtn'),
    eraseBrushBtn: document.getElementById('eraseBrushBtn'),
    paintSizeRange: document.getElementById('paintSizeRange'),
    paintColorPicker: document.getElementById('paintColorPicker'),
    clearPaintBtn: document.getElementById('clearPaintBtn'),
    paintCanvas: document.getElementById('paintCanvas'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    emptyState: document.getElementById('emptyState'),
    compareArea: document.getElementById('compareArea'),
    recolorLoader: document.getElementById('recolorLoader'),
    carNameSearch: document.getElementById('carNameSearch'),
    carSearchResults: document.getElementById('carSearchResults'),
    carInfoSelect: document.getElementById('carInfoSelect'),
    vehicleManagementSelect: document.getElementById('vehicleManagementSelect'),
    carInfoImageWrap: document.getElementById('carInfoImageWrap'),
    carInfoEmpty: document.getElementById('carInfoEmpty'),
    carInfoImage: document.getElementById('carInfoImage'),
    carInfoTitle: document.getElementById('carInfoTitle'),
    carInfoActions: document.getElementById('carInfoActions'),
    vehicleManagementViewer: document.getElementById('vehicleManagementViewer'),
    vehicleManagementEmpty: document.getElementById('vehicleManagementEmpty'),
    vehicleManagementImageWrap: document.getElementById('vehicleManagementImageWrap'),
    vehicleManagementImage: document.getElementById('vehicleManagementImage'),
    vehicleManagementTitle: document.getElementById('vehicleManagementTitle'),
    vehicleManagementActions: document.getElementById('vehicleManagementActions'),
    updateCarImageInput: document.getElementById('updateCarImageInput'),
    saveCarImageBtn: document.getElementById('saveCarImageBtn'),
    deleteCarBtn: document.getElementById('deleteCarBtn'),
    updateCarImageFeedback: document.getElementById('updateCarImageFeedback'),
    deleteCarFeedback: document.getElementById('deleteCarFeedback'),
    newCarBrand: document.getElementById('newCarBrand'),
    newCarModel: document.getElementById('newCarModel'),
    newCarImage: document.getElementById('newCarImage'),
    addCarBtn: document.getElementById('addCarBtn'),
    addCarFeedback: document.getElementById('addCarFeedback'),
    addCarDetailsBtn: document.getElementById('addCarDetailsBtn'),
    viewCarInfoBtn: document.getElementById('viewCarInfoBtn'),
    carDetailsEditorScreen: document.getElementById('carDetailsEditorScreen'),
    detailHeading: document.getElementById('detailHeading'),
    detailFontStyle: document.getElementById('detailFontStyle'),
    detailDescription: document.getElementById('detailDescription'),
    detailWordCount: document.getElementById('detailWordCount'),
    addSectionBtn: document.getElementById('addSectionBtn'),
    previewDetailsBtn: document.getElementById('previewDetailsBtn'),
    backToManagementBtn: document.getElementById('backToManagementBtn'),
    detailFormError: document.getElementById('detailFormError'),
    detailSectionList: document.getElementById('detailSectionList'),
    carDetailsPreviewScreen: document.getElementById('carDetailsPreviewScreen'),
    previewSectionList: document.getElementById('previewSectionList'),
    saveDetailsOrderBtn: document.getElementById('saveDetailsOrderBtn'),
    backToEditorBtn: document.getElementById('backToEditorBtn'),
    carDetailsViewScreen: document.getElementById('carDetailsViewScreen'),
    savedDetailsList: document.getElementById('savedDetailsList'),
    closeDetailsViewBtn: document.getElementById('closeDetailsViewBtn'),
    adminModuleBtn: document.getElementById('adminModuleBtn'),
    adminModule: document.getElementById('adminModule'),
    newUsername: document.getElementById('newUsername'),
    newEmail: document.getElementById('newEmail'),
    newPassword: document.getElementById('newPassword'),
    newProfilePic: document.getElementById('newProfilePic'),
    addUserForm: document.getElementById('addUserForm'),
    addUserFormWrapper: document.getElementById('addUserFormWrapper'),
    toggleRegistrationHeader: document.getElementById('toggleRegistrationHeader'),
    registrationToggleIcon: document.getElementById('registrationToggleIcon'),
    addUserSubmitBtn: document.getElementById('addUserSubmitBtn'),
    addUserFeedback: document.getElementById('addUserFeedback'),
    userSearch: document.getElementById('userSearch'),
    userGridBody: document.getElementById('userGridBody'),
    userGridEmpty: document.getElementById('userGridEmpty'),
    forgotPasswordLink: document.getElementById('forgotPasswordLink'),
    mailUserSelect: document.getElementById('mailUserSelect'),
    mailDesignBtn: document.getElementById('mailDesignBtn'),
    sortUsernameHeader: document.getElementById('sortUsernameHeader'),
    sortDirectionIcon: document.getElementById('sortDirectionIcon'),
    viewUserModal: document.getElementById('viewUserModal'),
    closeViewUserModalBtn: document.getElementById('closeViewUserModalBtn'),
    viewUsernameVal: document.getElementById('viewUsernameVal'),
    viewEmailVal: document.getElementById('viewEmailVal'),
    viewIdVal: document.getElementById('viewIdVal'),
    editUserModal: document.getElementById('editUserModal'),
    closeEditUserModalBtn: document.getElementById('closeEditUserModalBtn'),
    editUsername: document.getElementById('editUsername'),
    editEmail: document.getElementById('editEmail'),
    editPassword: document.getElementById('editPassword'),
    editProfilePic: document.getElementById('editProfilePic'),
    editUserForm: document.getElementById('editUserForm'),
    saveEditUserBtn: document.getElementById('saveEditUserBtn'),
    cancelEditUserBtn: document.getElementById('cancelEditUserBtn'),
    editUserFeedback: document.getElementById('editUserFeedback'),
    userAuthModal: document.getElementById('userAuthModal'),
    closeUserAuthModalBtn: document.getElementById('closeUserAuthModalBtn'),
    saveUserAuthBtn: document.getElementById('saveUserAuthBtn'),
    cancelUserAuthBtn: document.getElementById('cancelUserAuthBtn'),
    authUserDisplay: document.getElementById('authUserDisplay'),
    authUserId: document.getElementById('authUserId'),
    authRecolor: document.getElementById('authRecolor'),
    authCarInfo: document.getElementById('authCarInfo'),
    authVehicleManagement: document.getElementById('authVehicleManagement'),
    authAdmin: document.getElementById('authAdmin'),
    userAuthFeedback: document.getElementById('userAuthFeedback'),
    userProfileHeaderWrap: document.getElementById('userProfileHeaderWrap'),
    userProfileHeaderBtn: document.getElementById('userProfileHeaderBtn'),
    headerUserPic: document.getElementById('headerUserPic'),
    userProfileDropdown: document.getElementById('userProfileDropdown'),
    dropdownUserPic: document.getElementById('dropdownUserPic'),
    dropdownUserName: document.getElementById('dropdownUserName'),
    dropdownUserEmail: document.getElementById('dropdownUserEmail'),
    dropdownLogoutBtn: document.getElementById('dropdownLogoutBtn'),
    cinematicWindow: document.getElementById('cinematicWindow'),
    cinematicGlow: document.getElementById('cinematicGlow'),
    cinematicScanner: document.getElementById('cinematicScanner'),
    cinematicCarImage: document.getElementById('cinematicCarImage'),
    cinematicCarWrap: document.getElementById('cinematicCarWrap'),
    cinematicModePulse: document.getElementById('cinematicModePulse'),
    cinematicModeDrift: document.getElementById('cinematicModeDrift'),
    cinematicModeCyber: document.getElementById('cinematicModeCyber'),
    cinematicSwatches: document.getElementById('cinematicSwatches'),
    cinematicColorText: document.getElementById('cinematicColorText'),
    cinematicRotationText: document.getElementById('cinematicRotationText'),
    editUserId: document.getElementById('editUserId'),
    deleteUserModal: document.getElementById('deleteUserModal'),
    closeDeleteUserModalBtn: document.getElementById('closeDeleteUserModalBtn'),
    deleteUserTargetName: document.getElementById('deleteUserTargetName'),
    confirmDeleteUserBtn: document.getElementById('confirmDeleteUserBtn'),
    cancelDeleteUserBtn: document.getElementById('cancelDeleteUserBtn'),
    mailAttachmentModal: document.getElementById('mailAttachmentModal'),
    closeMailAttachmentModalBtn: document.getElementById('closeMailAttachmentModalBtn'),
    closeMailAttachmentModalBtn2: document.getElementById('closeMailAttachmentModalBtn2'),
    openGmailDraftBtn: document.getElementById('openGmailDraftBtn'),
    originalDownloadStatus: document.getElementById('originalDownloadStatus'),
    recoloredDownloadStatus: document.getElementById('recoloredDownloadStatus'),
    clipboardStatusIcon: document.getElementById('clipboardStatusIcon'),
    clipboardStatusText: document.getElementById('clipboardStatusText'),
    originalDownloadName: document.getElementById('originalDownloadName'),
    recoloredDownloadName: document.getElementById('recoloredDownloadName')
};

// ─────────────────────────────────────────────
//  Boot
// ─────────────────────────────────────────────
bootLogin();

async function refreshValidEmails() {
    try {
        const response = await fetch('/api/auth/emails');
        if (response.ok) {
            window.validEmails = await response.json();
        }
    } catch (err) {
        console.error('Failed to load validation emails:', err);
    }
}

function bootLogin() {
    refreshValidEmails();

    el.loginForm.addEventListener('submit', handleLoginSubmit);
    el.logoutBtn.addEventListener('click', handleLogoutClick);

    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', () => {
            const passwordInput = el.loginPassword;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleLoginPassword.style.color = '#00d4ff';
            } else {
                passwordInput.type = 'password';
                toggleLoginPassword.style.color = 'rgba(255, 255, 255, 0.4)';
            }
        });
    }

    if (el.forgotPasswordLink) {
        el.forgotPasswordLink.addEventListener('click', handleForgotPasswordClick);
    }


    el.loginUsername.value = '';
    el.loginPassword.value = '';

    // Initialize flying error message
    const errorMessageContainer = document.getElementById('dynamicErrorMessage');
    const errorText = "Please enter valid credentials";
    window.errorSpans = [];
    if (errorMessageContainer) {
        errorText.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space

            errorMessageContainer.appendChild(span);
            window.errorSpans.push(span);
        });
    }

    let lastDodgeTime = 0;

    // "Catch me if you can" button effect
    const dodgeButton = (e) => {
        const username = el.loginUsername.value.trim().toLowerCase();
        const password = el.loginPassword.value;

        const list = window.validEmails || ['jojogeorge3344@gmail.com'];
        const isValid = list.some(email => email.toLowerCase() === username);

        // If not valid, make the button run away!
        if (!isValid || !password) {
            const btnRect = el.loginSubmitBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            // If triggered by mouse, use mouse coords, else just pick a random direction
            let dx = 0, dy = 0;
            if (e && e.clientX) {
                dx = btnCenterX - e.clientX;
                dy = btnCenterY - e.clientY;
            } else {
                dx = Math.random() - 0.5;
                dy = Math.random() - 0.5;
            }

            let pushX = (dx > 0 ? 1 : -1) * (Math.random() * 80 + 60);
            let pushY = (dy > 0 ? 1 : -1) * (Math.random() * 60 + 30);

            el.loginSubmitBtn.style.transform = `translate(${pushX}px, ${pushY}px)`;

            // Trigger Flying Error Message
            triggerFlyingError();

            // Play fail sound (throttled to avoid overlapping spam on rapid mouse movement)
            const now = Date.now();
            if (now - lastDodgeTime > 250) {
                try {
                    const failAudio = new Audio('/sounds/Login Button sound for failure.mp3');
                    failAudio.play().catch(e => console.warn('Fail audio prevented:', e));
                    lastDodgeTime = now;
                } catch (e) { }
            }

            return true; // dodged
        } else {
            el.loginSubmitBtn.style.transform = `translate(0, 0)`;
            hideFlyingError();
            return false; // didn't dodge
        }
    };

    el.loginSubmitBtn.addEventListener('mousemove', dodgeButton);
    el.loginSubmitBtn.addEventListener('mouseenter', dodgeButton);

    // Reset button when mouse leaves the form entirely
    el.loginForm.addEventListener('mouseleave', () => {
        el.loginSubmitBtn.style.transform = `translate(0, 0)`;
    });
}

function handleForgotPasswordClick(e) {
    e.preventDefault();
    const emailVal = el.loginUsername.value.trim();
    if (!emailVal) {
        setLoginError('Please enter your email in the username field first.');
        el.loginUsername.focus();
        return;
    }

    // Construct Google Mail compose URL
    const subject = encodeURIComponent("Password Reset Request - CarColourStudio");
    const body = encodeURIComponent(`Hello Admin,\n\nI need to reset the password for my account registered under the following email address:\n\nEmail: ${emailVal}\n\nPlease send me a password reset option.\n\nThank you.`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=jojogeorge3344@gmail.com&su=${subject}&body=${body}`;

    // Open Gmail in a new tab
    window.open(gmailUrl, '_blank');
}

function renderCurrentUserHeader() {
    if (!state.currentUser) return;
    const user = state.currentUser;
    const profilePicSrc = user.profilePic ? `/${user.profilePic}` : '/images/default_avatar.png';
    if (el.headerUserPic) {
        el.headerUserPic.src = profilePicSrc;
    }
    if (el.dropdownUserPic) {
        el.dropdownUserPic.src = profilePicSrc;
    }
    if (el.dropdownUserName) {
        el.dropdownUserName.textContent = user.username || 'Admin User';
    }
    if (el.dropdownUserEmail) {
        el.dropdownUserEmail.textContent = user.email || 'admin@gmail.com';
    }
}

function applyUserAuthorization(user) {
    if (!user) return;
    const disabled = user.disabledModules || [];

    const recolorDisabled = disabled.includes('recolor');
    const carInfoDisabled = disabled.includes('carInfo');
    const vehicleManagementDisabled = disabled.includes('vehicleManagement');
    const adminDisabled = disabled.includes('admin');

    el.recolorModuleBtn.classList.toggle('hidden', recolorDisabled);
    el.carInfoModuleBtn.classList.toggle('hidden', carInfoDisabled);
    el.vehicleManagementModuleBtn.classList.toggle('hidden', vehicleManagementDisabled);
    if (el.adminModuleBtn) el.adminModuleBtn.classList.toggle('hidden', adminDisabled);

    let activeModule = 'recolor';
    if (el.recolorModuleBtn.classList.contains('active')) activeModule = 'recolor';
    else if (el.carInfoModuleBtn.classList.contains('active')) activeModule = 'carInfo';
    else if (el.vehicleManagementModuleBtn.classList.contains('active')) activeModule = 'vehicleManagement';
    else if (el.adminModuleBtn && el.adminModuleBtn.classList.contains('active')) activeModule = 'admin';

    if (disabled.includes(activeModule)) {
        if (!recolorDisabled) setActiveModule('recolor');
        else if (!carInfoDisabled) setActiveModule('carInfo');
        else if (!vehicleManagementDisabled) setActiveModule('vehicleManagement');
        else if (!adminDisabled) setActiveModule('admin');
    }
}

function toggleProfileDropdown() {
    if (el.userProfileDropdown) {
        el.userProfileDropdown.classList.toggle('hidden');
    }
}

function toggleRegistrationPanel() {
    if (!el.addUserFormWrapper) return;
    const isExpanded = el.addUserFormWrapper.classList.toggle('expanded');
    if (el.registrationToggleIcon) {
        el.registrationToggleIcon.textContent = isExpanded ? '▾' : '▸';
    }
}

function toggleUserSort() {
    if (state.userSortDirection === 'none') {
        state.userSortDirection = 'asc';
    } else if (state.userSortDirection === 'asc') {
        state.userSortDirection = 'desc';
    } else {
        state.userSortDirection = 'none';
    }

    if (el.sortDirectionIcon) {
        if (state.userSortDirection === 'asc') {
            el.sortDirectionIcon.textContent = '▲';
            el.sortDirectionIcon.style.color = '#00d4ff';
        } else if (state.userSortDirection === 'desc') {
            el.sortDirectionIcon.textContent = '▼';
            el.sortDirectionIcon.style.color = '#00d4ff';
        } else {
            el.sortDirectionIcon.textContent = '⇅';
            el.sortDirectionIcon.style.color = 'rgba(255,255,255,0.3)';
        }
    }

    applyUserFilter();
}

window.isFlyingErrorShowing = false;
window.flyingErrorTimeout = null;

function triggerFlyingError() {
    if (window.isFlyingErrorShowing || !window.errorSpans) return;
    window.isFlyingErrorShowing = true;

    // Assemble the letters from the deep background
    window.errorSpans.forEach((span, index) => {
        span.classList.remove('shattering'); // Cancel any ongoing shatter
        setTimeout(() => {
            span.classList.add('assembled');
            // Sound removed
            try { } catch (e) { }
        }, index * 100); // 100ms stagger per letter for clear "one by one" feel
    });

    if (window.flyingErrorTimeout) clearTimeout(window.flyingErrorTimeout);
    window.flyingErrorTimeout = setTimeout(() => {
        hideFlyingError();
    }, 5000); // Shatter after 5 seconds to allow full assembly
}

function hideFlyingError() {
    if (!window.isFlyingErrorShowing || !window.errorSpans) return;
    window.isFlyingErrorShowing = false;

    // Cinematic 3D Shatter towards the camera
    window.errorSpans.forEach((span, index) => {
        setTimeout(() => {
            span.classList.remove('assembled');
            span.classList.add('shattering');
            // Sound removed
            try { } catch (e) { }
        }, index * 100); // 100ms stagger for shattering one by one
    });

    // Cleanup shattering class after animation finishes so it can trigger again
    setTimeout(() => {
        window.errorSpans.forEach(span => {
            span.classList.remove('shattering');
        });
    }, (window.errorSpans.length * 100) + 2000);
}

async function handleLoginSubmit(event) {
    event.preventDefault();

    const username = el.loginUsername.value.trim().toLowerCase();
    const password = el.loginPassword.value;

    const list = window.validEmails || ['jojogeorge3344@gmail.com'];
    const isValid = list.some(email => email.toLowerCase() === username);

    // If they manage to submit via keyboard or fast clicking while invalid, force dodge and abort!
    if (!isValid || !password) {
        // Pick a random aggressive direction
        const pushX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100 + 80);
        const pushY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 80 + 40);
        el.loginSubmitBtn.style.transform = `translate(${pushX}px, ${pushY}px)`;
        try {
            const failAudio = new Audio('/sounds/Login Button sound for failure.mp3');
            failAudio.play().catch(e => console.warn('Fail audio prevented:', e));
        } catch (e) { }
        return;
    }

    el.loginSubmitBtn.disabled = true;
    setLoginError('');

    let isSuccess = false;
    try {
        isSuccess = await authenticateLogin(username, password);
    } catch (error) {
        console.error('Login validation failed:', error);
        setLoginError('Unable to validate login right now. Please try again.');
        el.loginSubmitBtn.disabled = false;
        return;
    }

    if (!isSuccess) {
        setLoginError('Login failed. Username or password is incorrect.');
        el.loginPassword.value = '';
        el.loginUsername.focus();
        el.loginSubmitBtn.disabled = false;
        return;
    }

    // Wait for exactly 3 seconds after successful login before starting the animation
    //await new Promise(resolve => setTimeout(resolve, 3000));

    // --- FIRE & 3D CAR BLAST SEQUENCE ---
    // Play Audio IMMEDIATELY
    try {
        const audio = new Audio('/sounds/login-success.mp3');
        audio.play().catch(e => console.warn('Audio play prevented:', e));
    } catch (e) { }

    // The real video fire starts, overlaying the login design
    const fireVideo = document.getElementById('fireVideo');
    if (fireVideo) {
        fireVideo.classList.add('burning');
        fireVideo.play().catch(e => console.warn('Video play prevented:', e));
    }

    // The login form quickly dissolves over 1.5 seconds while the fire burns it
    const loginFormContainer = document.getElementById('loginFormContainer');
    if (loginFormContainer) {
        loginFormContainer.style.transition = 'opacity 1.5s ease-in';
        loginFormContainer.style.opacity = '0';
    }

    // Reveal the 3D car and start it driving towards the camera 3 times with different colors
    const blastCar = document.getElementById('blastCar');
    if (blastCar) {
        blastCar.classList.remove('hidden');

        const hueRotations = [0, 190, 280];
        for (let i = 0; i < 3; i++) {
            // Apply different color filter for each run
            blastCar.style.filter = `hue-rotate(${hueRotations[i]}deg) saturate(1.5)`;

            // Trigger car animation
            blastCar.classList.remove('blasting');
            void blastCar.offsetWidth; // Force reflow
            blastCar.classList.add('blasting');

            // Trigger the screen white-out blast flash animation
            el.loginScreen.classList.remove('login-blast-animation');
            void el.loginScreen.offsetWidth; // Force reflow
            el.loginScreen.classList.add('login-blast-animation');

            // Wait for the car to drive past the camera (1.5s total animation)
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    // Cleanup and load app
    if (fireVideo) {
        fireVideo.pause();
        fireVideo.currentTime = 0;
        fireVideo.classList.remove('burning');
    }
    if (blastCar) {
        blastCar.classList.add('hidden');
        blastCar.classList.remove('blasting');
        blastCar.style.filter = ''; // Reset filter
    }
    if (loginFormContainer) {
        loginFormContainer.style.transition = '';
        loginFormContainer.style.opacity = '1';
    }

    el.loginScreen.classList.add('hidden');
    el.loginScreen.classList.remove('login-blast-animation');
    el.appShell.classList.remove('hidden');
    await startApp();

    el.loginSubmitBtn.disabled = false;
}

async function startApp() {
    if (appInitialized) {
        setActiveModule('recolor');
        return;
    }

    appInitialized = true;
    await init();
    setActiveModule('recolor');
}



async function handleLogoutClick() {
    if (el.dropdownLogoutBtn) el.dropdownLogoutBtn.disabled = true;
    el.logoutBtn.disabled = true;

    localStorage.removeItem('currentUser');
    state.currentUser = null;

    if (el.userProfileDropdown) {
        el.userProfileDropdown.classList.add('hidden');
    }

    // Reset module nav buttons visibility on logout
    el.recolorModuleBtn.classList.remove('hidden');
    el.carInfoModuleBtn.classList.remove('hidden');
    el.vehicleManagementModuleBtn.classList.remove('hidden');
    if (el.adminModuleBtn) el.adminModuleBtn.classList.remove('hidden');

    setActiveModule('recolor');
    setLoginError('');
    el.loginPassword.value = '';
    el.loginScreen.classList.remove('hidden');
    el.appShell.classList.add('hidden');
    el.loginUsername.focus();

    el.logoutBtn.disabled = false;
    if (el.dropdownLogoutBtn) el.dropdownLogoutBtn.disabled = false;
}

async function authenticateLogin(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error('Login API failed');
    }

    const result = await response.json();
    if (result.success && result.user) {
        state.currentUser = result.user;
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        renderCurrentUserHeader();
        applyUserAuthorization(result.user);
    }
    return !!result.success;
}

function setLoginError(message) {
    el.loginError.textContent = message;
    el.loginError.classList.toggle('hidden', !message);
}

function startEngineSound() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            return;
        }

        stopEngineSound();

        engineAudioContext = new AudioContextClass();
        engineOscillator = engineAudioContext.createOscillator();
        engineGain = engineAudioContext.createGain();

        engineOscillator.type = 'sawtooth';
        engineOscillator.frequency.setValueAtTime(110, engineAudioContext.currentTime);
        engineOscillator.frequency.linearRampToValueAtTime(180, engineAudioContext.currentTime + 2.6);

        engineGain.gain.setValueAtTime(0.001, engineAudioContext.currentTime);
        engineGain.gain.linearRampToValueAtTime(0.06, engineAudioContext.currentTime + 0.25);

        engineOscillator.connect(engineGain);
        engineGain.connect(engineAudioContext.destination);
        engineOscillator.start();
    } catch (error) {
        console.error('Engine sound start failed:', error);
    }
}

function stopEngineSound() {
    try {
        if (engineGain && engineAudioContext) {
            engineGain.gain.cancelScheduledValues(engineAudioContext.currentTime);
            engineGain.gain.setTargetAtTime(0.0001, engineAudioContext.currentTime, 0.12);
        }

        if (engineOscillator) {
            engineOscillator.stop();
            engineOscillator.disconnect();
        }

        if (engineGain) {
            engineGain.disconnect();
        }

        if (engineAudioContext) {
            engineAudioContext.close();
        }
    } catch (error) {
        console.error('Engine sound stop failed:', error);
    } finally {
        engineAudioContext = null;
        engineOscillator = null;
        engineGain = null;
    }
}



async function init() {
    state.recent = loadRecent();
    renderRecent();

    try {
        const [cars, colors] = await Promise.all([
            fetchJson('/api/cars'),
            fetchJson('/api/colors')
        ]);

        state.cars = cars;
        state.colors = colors;

        populateRecolorCarBrandDropdown(cars);
        populateCarInfoDropdown(cars);
        renderCategoryFilter(colors);
        applyColorFilter();
        loadUsers();

    } catch (err) {
        console.error('Failed to initialise:', err);
    }

    wireEvents();
    setupPaintCanvas();
    updateWordCount();
}

// ─────────────────────────────────────────────
//  Populate car dropdowns
// ─────────────────────────────────────────────
function populateRecolorCarBrandDropdown(cars) {
    while (el.carBrandSelect.options.length > 1) {
        el.carBrandSelect.remove(1);
    }

    const brands = [...new Set(cars.map(c => c.brand))].sort();

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        el.carBrandSelect.appendChild(option);
    });
}

function populateRecolorCarModelDropdown(brand) {
    while (el.carSelect.options.length > 1) {
        el.carSelect.remove(1);
    }
    el.carSelect.value = '';

    if (!brand) return;

    const filteredCars = state.cars.filter(c => c.brand === brand);
    filteredCars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = car.model;
        el.carSelect.appendChild(option);
    });
}

function populateCarInfoDropdown(cars, searchTerm = '') {
    while (el.carInfoSelect.options.length > 1) {
        el.carInfoSelect.remove(1);
    }
    while (el.vehicleManagementSelect.options.length > 1) {
        el.vehicleManagementSelect.remove(1);
    }

    cars
        .filter(car => matchesCarTerm(car, searchTerm))
        .forEach(car => {
            const option1 = document.createElement('option');
            option1.value = car.id;
            option1.textContent = `${car.brand} ${car.model}`;
            el.carInfoSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = car.id;
            option2.textContent = `${car.brand} ${car.model}`;
            el.vehicleManagementSelect.appendChild(option2);
        });
}

// ─────────────────────────────────────────────
//  Event wiring
// ─────────────────────────────────────────────
function wireEvents() {
    el.recolorModuleBtn.addEventListener('click', () => setActiveModule('recolor'));
    el.carInfoModuleBtn.addEventListener('click', () => setActiveModule('carInfo'));
    el.vehicleManagementModuleBtn.addEventListener('click', () => setActiveModule('vehicleManagement'));

    el.carBrandSelect.addEventListener('change', e => {
        const brand = e.target.value;
        populateRecolorCarModelDropdown(brand);
        if (state.selectedCar && state.selectedCar.brand !== brand) {
            resetRecolorViewerForNoCars();
        }
    });

    el.carSelect.addEventListener('change', e => {
        const carId = e.target.value;
        if (!carId) return;

        selectCar(carId);
        el.carInfoSelect.value = carId;
        el.vehicleManagementSelect.value = carId;
        renderCarInfo(carId);
    });

    el.carNameSearch.addEventListener('input', debounce(applyCarInfoSearch, 120));

    el.carInfoSelect.addEventListener('change', e => {
        const carId = e.target.value;
        el.vehicleManagementSelect.value = carId;
        if (!carId) {
            clearCarInfoPreview();
            return;
        }
        renderCarInfo(carId);
    });

    el.vehicleManagementSelect.addEventListener('change', e => {
        const carId = e.target.value;
        el.carInfoSelect.value = carId;
        if (!carId) {
            clearCarInfoPreview();
            return;
        }
        renderCarInfo(carId);
    });

    el.addCarBtn.addEventListener('click', handleAddCar);
    el.saveCarImageBtn.addEventListener('click', handleUpdateCarImage);
    el.deleteCarBtn.addEventListener('click', handleDeleteCar);
    el.addCarDetailsBtn.addEventListener('click', openDetailsEditor);
    el.viewCarInfoBtn.addEventListener('click', openDetailsViewer);
    el.detailDescription.addEventListener('input', updateWordCount);
    el.addSectionBtn.addEventListener('click', addDetailSection);
    el.previewDetailsBtn.addEventListener('click', openPreviewScreen);
    el.backToManagementBtn = document.getElementById('backToManagementBtn');
    if (el.backToManagementBtn) {
        el.backToManagementBtn.addEventListener('click', () => {
            document.getElementById('carDetailsEditorScreen').classList.add('hidden');
        });
    }
    el.saveDetailsOrderBtn.addEventListener('click', savePreviewOrder);
    el.backToEditorBtn.addEventListener('click', () => showScreen('editor'));
    el.closeDetailsViewBtn.addEventListener('click', showDefaultCarInfoScreen);

    el.colorSearch.addEventListener('input', debounce(applyColorFilter, 120));
    el.categoryFilter.addEventListener('change', applyColorFilter);

    el.customHex.addEventListener('input', e => {
        const value = e.target.value.trim();
        if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value)) {
            el.customHexPicker.value = value;
            applyColor({ name: `Custom ${value.toUpperCase()}`, hex: value.toUpperCase(), category: 'Custom' });
        }
    });

    el.customHexPicker.addEventListener('input', e => {
        const hex = e.target.value.toUpperCase();
        el.customHex.value = hex;
        applyColor({ name: `Custom ${hex}`, hex, category: 'Custom' });
    });

    el.compareSlider.addEventListener('input', e => {
        const pct = e.target.value;
        el.sliderOverlay.style.width = `${pct}%`;
        el.sliderDivider.style.left = `${pct}%`;
    });

    el.zoomRange.addEventListener('input', e => {
        const scale = Number(e.target.value);
        [el.originalImage, el.recoloredImage, el.sliderOriginal, el.sliderRecolored, el.paintCanvas].forEach(img => {
            img.style.transform = `scale(${scale})`;
        });
    });

    if (el.mailUserSelect) {
        el.mailUserSelect.addEventListener('change', updateMailButtonState);
    }
    if (el.mailDesignBtn) {
        el.mailDesignBtn.addEventListener('click', handleMailDesignClick);
    }

    el.paintBrushBtn.addEventListener('click', () => setPaintTool('brush'));
    el.eraseBrushBtn.addEventListener('click', () => setPaintTool('eraser'));
    el.paintSizeRange.addEventListener('input', e => {
        state.paint.size = Number(e.target.value);
    });
    el.paintColorPicker.addEventListener('input', e => {
        state.paint.color = e.target.value.toUpperCase();
    });
    el.clearPaintBtn.addEventListener('click', clearPaintCanvas);

    window.addEventListener('resize', resizePaintCanvas);
    document.addEventListener('fullscreenchange', resizePaintCanvas);
    el.recoloredImage.addEventListener('load', resizePaintCanvas);

    el.downloadRecoloredBtn.addEventListener('click', downloadRecoloredImage);

    el.fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            el.viewer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Wire Admin module events
    if (el.adminModuleBtn) el.adminModuleBtn.addEventListener('click', () => setActiveModule('admin'));
    if (el.addUserForm) el.addUserForm.addEventListener('submit', handleAddUser);
    if (el.toggleRegistrationHeader) {
        el.toggleRegistrationHeader.addEventListener('click', toggleRegistrationPanel);
    }
    if (el.sortUsernameHeader) {
        el.sortUsernameHeader.addEventListener('click', toggleUserSort);
    }
    if (el.userSearch) el.userSearch.addEventListener('input', debounce(applyUserFilter, 120));
    if (el.closeViewUserModalBtn) el.closeViewUserModalBtn.addEventListener('click', closeViewUserModal);
    if (el.closeEditUserModalBtn) el.closeEditUserModalBtn.addEventListener('click', closeEditUserModal);
    if (el.cancelEditUserBtn) el.cancelEditUserBtn.addEventListener('click', closeEditUserModal);
    if (el.editUserForm) el.editUserForm.addEventListener('submit', handleEditUserSubmit);

    // Delete confirmation modal events
    if (el.closeDeleteUserModalBtn) el.closeDeleteUserModalBtn.addEventListener('click', closeDeleteUserModal);
    if (el.cancelDeleteUserBtn) el.cancelDeleteUserBtn.addEventListener('click', closeDeleteUserModal);
    if (el.confirmDeleteUserBtn) el.confirmDeleteUserBtn.addEventListener('click', handleConfirmDeleteUser);

    // Mail attachment modal events
    if (el.closeMailAttachmentModalBtn) el.closeMailAttachmentModalBtn.addEventListener('click', closeMailAttachmentModal);
    if (el.closeMailAttachmentModalBtn2) el.closeMailAttachmentModalBtn2.addEventListener('click', closeMailAttachmentModal);

    // User authorization modal events
    if (el.closeUserAuthModalBtn) el.closeUserAuthModalBtn.addEventListener('click', closeUserAuthModal);
    if (el.cancelUserAuthBtn) el.cancelUserAuthBtn.addEventListener('click', closeUserAuthModal);
    if (el.saveUserAuthBtn) el.saveUserAuthBtn.addEventListener('click', handleSaveUserAuthClick);

    // 3D Cinematic click events
    if (el.cinematicModePulse) el.cinematicModePulse.addEventListener('click', () => setCinematicMode('pulse'));
    if (el.cinematicModeDrift) el.cinematicModeDrift.addEventListener('click', () => setCinematicMode('drift'));
    if (el.cinematicModeCyber) el.cinematicModeCyber.addEventListener('click', () => setCinematicMode('cyber'));

    if (el.cinematicSwatches) {
        el.cinematicSwatches.addEventListener('click', e => {
            const swatch = e.target.closest('.cinematic-swatch');
            if (!swatch) return;
            const hex = swatch.dataset.hex;
            setCinematicColor(hex, swatch);
        });
    }

    if (el.cinematicWindow) {
        el.cinematicWindow.addEventListener('mousemove', handleCinematicMouseMove);
        el.cinematicWindow.addEventListener('mouseleave', resetCinematicPerspective);
    }

    if (el.userProfileHeaderBtn) {
        el.userProfileHeaderBtn.addEventListener('click', toggleProfileDropdown);
    }
    if (el.dropdownLogoutBtn) {
        el.dropdownLogoutBtn.addEventListener('click', handleLogoutClick);
    }
    document.addEventListener('click', e => {
        if (el.userProfileDropdown && !el.userProfileDropdown.classList.contains('hidden')) {
            if (!el.userProfileHeaderWrap.contains(e.target)) {
                el.userProfileDropdown.classList.add('hidden');
            }
        }
    });
}

function setActiveModule(module) {
    const showRecolor = module === 'recolor';
    const showCarInfo = module === 'carInfo';
    const showVehicleManagement = module === 'vehicleManagement';
    const showAdmin = module === 'admin';

    el.recolorModuleBtn.classList.toggle('active', showRecolor);
    el.carInfoModuleBtn.classList.toggle('active', showCarInfo);
    el.vehicleManagementModuleBtn.classList.toggle('active', showVehicleManagement);
    if (el.adminModuleBtn) el.adminModuleBtn.classList.toggle('active', showAdmin);

    el.recolorModule.classList.toggle('hidden', !showRecolor);
    el.carInfoModule.classList.toggle('hidden', !showCarInfo);
    el.vehicleManagementModule.classList.toggle('hidden', !showVehicleManagement);
    if (el.adminModule) el.adminModule.classList.toggle('hidden', !showAdmin);

    if (showCarInfo || showVehicleManagement) {
        el.carInfoSelect.value = '';
        el.vehicleManagementSelect.value = '';
        clearCarInfoPreview();
    }

    if (showAdmin) {
        loadUsers();
    }
}

// ─────────────────────────────────────────────
//  Car selection → display image
// ─────────────────────────────────────────────
function selectCar(carId) {
    const car = state.cars.find(c => c.id === carId);
    if (!car) return;

    state.selectedCar = car;
    state.selectedColor = null;
    el.downloadRecoloredBtn.disabled = true;
    clearPaintCanvas();

    const src = `/${car.image}`;

    [el.originalImage, el.recoloredImage, el.sliderOriginal, el.sliderRecolored].forEach(img => {
        img.src = src;
        img.alt = `${car.brand} ${car.model}`;
    });

    setStatusLabel(el.selectedCarLabel, '🚗', `${car.model}`);
    setStatusLabel(el.selectedColorLabel, '🎨', 'No colour selected');

    el.carBrandBadge.textContent = car.brand;
    el.carInfo.classList.remove('hidden');

    el.emptyState.classList.add('hidden');
    el.compareArea.classList.remove('hidden');

    el.compareSlider.value = 50;
    el.sliderOverlay.style.width = '50%';
    el.sliderDivider.style.left = '50%';
    el.zoomRange.value = 1;
    [el.originalImage, el.recoloredImage, el.sliderOriginal, el.sliderRecolored, el.paintCanvas].forEach(img => {
        img.style.transform = 'scale(1)';
    });
}

async function renderCarInfo(carId) {
    const car = state.cars.find(c => c.id === carId);
    if (!car) {
        clearCarInfoPreview();
        return;
    }

    state.selectedInfoCar = car;

    el.carInfoImage.src = `/${car.image}`;
    el.carInfoImage.alt = `${car.brand} ${car.model}`;
    el.carInfoTitle.textContent = `${car.brand} ${car.model}`;

    el.vehicleManagementImage.src = `/${car.image}`;
    el.vehicleManagementImage.alt = `${car.brand} ${car.model}`;
    el.vehicleManagementTitle.textContent = `${car.brand} ${car.model}`;

    await syncCarDetailsForCar(car.id);

    el.carInfoEmpty.classList.add('hidden');
    el.carInfoImageWrap.classList.remove('hidden');
    el.carInfoActions.classList.remove('hidden');

    el.vehicleManagementEmpty.classList.add('hidden');
    el.vehicleManagementImageWrap.classList.remove('hidden');
    el.vehicleManagementActions.classList.remove('hidden');

    setUpdateCarImageFeedback('', false, true);
    setDeleteCarFeedback('', false, true);

    if (!el.carDetailsViewScreen.classList.contains('hidden')) {
        openDetailsViewer();
    } else {
        showDefaultCarInfoScreen();
    }
}

function clearCarInfoPreview() {
    state.selectedInfoCar = null;
    el.carInfoImage.src = '';
    el.carInfoTitle.textContent = '';
    el.carInfoEmpty.classList.remove('hidden');
    el.carInfoImageWrap.classList.add('hidden');
    el.carInfoActions.classList.add('hidden');

    el.vehicleManagementImage.src = '';
    el.vehicleManagementTitle.textContent = '';
    el.vehicleManagementEmpty.classList.remove('hidden');
    el.vehicleManagementImageWrap.classList.add('hidden');
    el.vehicleManagementActions.classList.add('hidden');

    el.updateCarImageInput.value = '';
    setUpdateCarImageFeedback('', false, true);
    setDeleteCarFeedback('', false, true);
    hideDetailScreens();
}

function applyCarInfoSearch() {
    const term = el.carNameSearch.value.trim();
    const previous = el.carInfoSelect.value;
    const matchingCars = state.cars.filter(car => matchesCarTerm(car, term));

    populateCarInfoDropdown(state.cars, term);
    renderCarSearchResults(matchingCars, term);

    const canKeepPrevious = !!previous && [...el.carInfoSelect.options].some(option => option.value === previous);

    if (canKeepPrevious) {
        el.carInfoSelect.value = previous;
        renderCarInfo(previous);
        return;
    }

    clearCarInfoPreview();
    el.carInfoSelect.value = '';
}

function matchesCarTerm(car, term) {
    const t = term.trim().toLowerCase();
    if (!t) return true;

    return `${car.brand} ${car.model}`.toLowerCase().includes(t)
        || car.model.toLowerCase().includes(t)
        || car.brand.toLowerCase().includes(t);
}

function renderCarSearchResults(cars, term) {
    el.carSearchResults.innerHTML = '';

    if (!term) {
        el.carSearchResults.classList.add('hidden');
        return;
    }

    if (cars.length === 0) {
        el.carSearchResults.innerHTML = '<p class="car-search-empty">No matching cars found</p>';
        el.carSearchResults.classList.remove('hidden');
        return;
    }

    cars.forEach(car => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'car-search-item';
        item.textContent = `${car.brand} ${car.model}`;
        item.addEventListener('click', () => {
            el.carInfoSelect.value = car.id;
            el.carNameSearch.value = `${car.brand} ${car.model}`;
            renderCarInfo(car.id);
            el.carSearchResults.classList.add('hidden');
        });
        el.carSearchResults.appendChild(item);
    });

    el.carSearchResults.classList.remove('hidden');
}

async function handleAddCar() {
    const brand = el.newCarBrand.value.trim();
    const model = el.newCarModel.value.trim();
    const image = el.newCarImage.files?.[0];

    if (!brand || !model || !image) {
        setAddCarFeedback('Brand, model, and image are required.', true);
        return;
    }

    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('image', image);

    el.addCarBtn.disabled = true;
    setAddCarFeedback('Adding car...', false);

    try {
        const response = await fetch('/api/cars', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || 'Failed to add car.');
        }

        const createdCar = await response.json();
        state.cars = [...state.cars, createdCar].sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));

        populateRecolorCarBrandDropdown(state.cars);
        populateCarInfoDropdown(state.cars, el.carNameSearch.value.trim());

        el.carSelect.value = createdCar.id;
        selectCar(createdCar.id);

        el.carInfoSelect.value = createdCar.id;
        el.carNameSearch.value = `${createdCar.brand} ${createdCar.model}`;
        await renderCarInfo(createdCar.id);
        el.carSearchResults.classList.add('hidden');

        resetAddCarForm();
        setAddCarFeedback('Car added successfully.', false);
    } catch (err) {
        console.error('Add car failed:', err);
        setAddCarFeedback(err.message || 'Failed to add car. Please try again.', true);
    } finally {
        el.addCarBtn.disabled = false;
    }
}

function resetAddCarForm() {
    el.newCarBrand.value = '';
    el.newCarModel.value = '';
    el.newCarImage.value = '';
}

function setAddCarFeedback(message, isError) {
    el.addCarFeedback.textContent = message;
    el.addCarFeedback.classList.remove('hidden', 'error', 'success');
    el.addCarFeedback.classList.add(isError ? 'error' : 'success');
}

async function handleUpdateCarImage() {
    const carId = getCurrentInfoCarId();
    const image = el.updateCarImageInput.files?.[0];

    if (!carId) {
        setUpdateCarImageFeedback('Select a car first.', true);
        return;
    }

    if (!image) {
        setUpdateCarImageFeedback('Select a new image file first.', true);
        return;
    }

    const formData = new FormData();
    formData.append('image', image);

    el.saveCarImageBtn.disabled = true;
    setUpdateCarImageFeedback('Saving new image...', false);

    try {
        const response = await fetch(`/api/cars/${encodeURIComponent(carId)}/image`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || 'Failed to update car image.');
        }

        const updatedCar = await response.json();
        state.cars = state.cars.map(car => car.id === updatedCar.id ? updatedCar : car);

        const cacheBust = Date.now();
        if (state.selectedInfoCar?.id === updatedCar.id) {
            state.selectedInfoCar = updatedCar;
            el.carInfoImage.src = `/${updatedCar.image}?v=${cacheBust}`;
            el.carInfoImage.alt = `${updatedCar.brand} ${updatedCar.model}`;
            el.carInfoTitle.textContent = `${updatedCar.brand} ${updatedCar.model}`;
        }

        if (state.selectedCar?.id === updatedCar.id) {
            state.selectedCar = updatedCar;
            const src = `/${updatedCar.image}?v=${cacheBust}`;
            [el.originalImage, el.recoloredImage, el.sliderOriginal, el.sliderRecolored].forEach(img => {
                img.src = src;
                img.alt = `${updatedCar.brand} ${updatedCar.model}`;
            });
            setStatusLabel(el.selectedCarLabel, '🚗', `${updatedCar.model}`);
            setStatusLabel(el.selectedColorLabel, '🎨', 'No colour selected');
            el.downloadRecoloredBtn.disabled = true;
            state.selectedColor = null;
            clearPaintCanvas();
        }

        populateRecolorCarBrandDropdown(state.cars);
        populateCarInfoDropdown(state.cars, el.carNameSearch.value.trim());
        el.carSelect.value = updatedCar.id;
        el.carInfoSelect.value = updatedCar.id;
        el.updateCarImageInput.value = '';
        setUpdateCarImageFeedback('Car image updated successfully.', false);
    } catch (err) {
        console.error('Update car image failed:', err);
        setUpdateCarImageFeedback(err.message || 'Failed to update car image. Please try again.', true);
    } finally {
        el.saveCarImageBtn.disabled = false;
    }
}

async function handleDeleteCar() {
    const carId = getCurrentInfoCarId();
    if (!carId) {
        setDeleteCarFeedback('Select a car first.', true);
        return;
    }

    const car = state.cars.find(c => c.id === carId);
    if (!car) {
        setDeleteCarFeedback('Car not found in current list.', true);
        return;
    }

    const confirmed = window.confirm(`Delete ${car.brand} ${car.model}? This removes image and details permanently.`);
    if (!confirmed) {
        return;
    }

    el.deleteCarBtn.disabled = true;
    setDeleteCarFeedback('Deleting car...', false);

    try {
        const response = await fetch(`/api/cars/${encodeURIComponent(carId)}`, { method: 'DELETE' });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || 'Failed to delete car.');
        }

        state.cars = state.cars.filter(item => item.id !== carId);
        delete state.carDetailsByCar[carId];

        populateRecolorCarBrandDropdown(state.cars);
        populateCarInfoDropdown(state.cars, el.carNameSearch.value.trim());

        if (state.cars.length === 0) {
            el.carSelect.value = '';
            el.carInfoSelect.value = '';
            clearCarInfoPreview();
            resetRecolorViewerForNoCars();
            setDeleteCarFeedback('Car deleted successfully.', false);
            return;
        }

        const fallbackCar = state.cars[0];
        el.carSelect.value = fallbackCar.id;
        el.carInfoSelect.value = fallbackCar.id;
        selectCar(fallbackCar.id);
        await renderCarInfo(fallbackCar.id);
        setDeleteCarFeedback('Car deleted successfully.', false);
    } catch (err) {
        console.error('Delete car failed:', err);
        setDeleteCarFeedback(err.message || 'Failed to delete car. Please try again.', true);
    } finally {
        el.deleteCarBtn.disabled = false;
    }
}

function setUpdateCarImageFeedback(message, isError, hide = false) {
    if (hide) {
        el.updateCarImageFeedback.textContent = '';
        el.updateCarImageFeedback.classList.add('hidden');
        el.updateCarImageFeedback.classList.remove('error', 'success');
        return;
    }

    el.updateCarImageFeedback.textContent = message;
    el.updateCarImageFeedback.classList.remove('hidden', 'error', 'success');
    el.updateCarImageFeedback.classList.add(isError ? 'error' : 'success');
}

function setDeleteCarFeedback(message, isError, hide = false) {
    if (hide) {
        el.deleteCarFeedback.textContent = '';
        el.deleteCarFeedback.classList.add('hidden');
        el.deleteCarFeedback.classList.remove('error', 'success');
        return;
    }

    el.deleteCarFeedback.textContent = message;
    el.deleteCarFeedback.classList.remove('hidden', 'error', 'success');
    el.deleteCarFeedback.classList.add(isError ? 'error' : 'success');
}

function resetRecolorViewerForNoCars() {
    state.selectedCar = null;
    state.selectedColor = null;
    el.downloadRecoloredBtn.disabled = true;
    clearPaintCanvas();

    [el.originalImage, el.recoloredImage, el.sliderOriginal, el.sliderRecolored].forEach(img => {
        img.src = '';
        img.alt = '';
    });

    el.carInfo.classList.add('hidden');
    el.compareArea.classList.add('hidden');
    el.emptyState.classList.remove('hidden');
    setStatusLabel(el.selectedCarLabel, '🚗', 'No car selected');
    setStatusLabel(el.selectedColorLabel, '🎨', 'No colour selected');
}

// ─────────────────────────────────────────────
//  Car details screens
// ─────────────────────────────────────────────
function showDefaultCarInfoScreen() {
    hideDetailScreens();
    clearDetailFormError();
}

function hideDetailScreens() {
    el.carDetailsEditorScreen.classList.add('hidden');
    el.carDetailsPreviewScreen.classList.add('hidden');
    el.carDetailsViewScreen.classList.add('hidden');
}

function showScreen(screen) {
    hideDetailScreens();

    if (screen === 'editor') el.carDetailsEditorScreen.classList.remove('hidden');
    if (screen === 'preview') el.carDetailsPreviewScreen.classList.remove('hidden');
    if (screen === 'view') el.carDetailsViewScreen.classList.remove('hidden');
}

async function openDetailsEditor() {
    const carId = getCurrentInfoCarId();
    if (!carId) return;

    await syncCarDetailsForCar(carId);
    state.draftSections = cloneSections(getSavedSections(carId));
    renderDraftSections();
    resetDetailForm();
    updateWordCount();
    clearDetailFormError();
    showScreen('editor');
}

async function addDetailSection() {
    const result = validateSectionInputs();
    if (!result.success) {
        showDetailFormError(result.message);
        return;
    }

    clearDetailFormError();
    state.draftSections.push({
        id: crypto.randomUUID(),
        heading: el.detailHeading.value.trim(),
        description: el.detailDescription.value.trim(),
        fontStyle: el.detailFontStyle.value
    });

    const carId = getCurrentInfoCarId();
    if (carId) {
        state.carDetailsByCar[carId] = cloneSections(state.draftSections);
        try {
            await fetch(`/api/car-details/${encodeURIComponent(carId)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.draftSections)
            });
        } catch (e) {
            console.error('Failed to auto-save detail section:', e);
        }
    }

    renderDraftSections();
    resetDetailForm();
    updateWordCount();
}

function openPreviewScreen() {
    if (state.draftSections.length === 0) {
        showDetailFormError('Add at least one heading and description before preview.');
        showScreen('editor');
        return;
    }

    clearDetailFormError();
    showScreen('preview');
    renderPreviewSections();
}

async function openDetailsViewer() {
    const carId = getCurrentInfoCarId();
    if (!carId) return;

    await syncCarDetailsForCar(carId);
    const saved = getSavedSections(carId);
    renderSavedDetails(saved);
    showScreen('view');
}

async function savePreviewOrder() {
    const carId = getCurrentInfoCarId();
    if (!carId) return;

    const payload = cloneSections(state.draftSections);

    try {
        const response = await fetch(`/api/car-details/${encodeURIComponent(carId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Save failed');
        }

        state.carDetailsByCar[carId] = payload;
        renderSavedDetails(state.carDetailsByCar[carId]);
        showScreen('view');
    } catch (err) {
        showDetailFormError('Failed to save car details. Please try again.');
        console.error('Save car details failed:', err);
    }
}

function renderDraftSections() {
    el.detailSectionList.innerHTML = '';

    if (state.draftSections.length === 0) {
        el.detailSectionList.innerHTML = '<p class="car-search-empty">No sections added yet.</p>';
        return;
    }

    state.draftSections.forEach(section => {
        const card = document.createElement('div');
        card.className = 'detail-item';

        const heading = document.createElement('h4');
        heading.textContent = section.heading;
        applyFont(heading, section.fontStyle);

        const description = document.createElement('p');
        description.textContent = section.description;
        applyFont(description, section.fontStyle);

        card.append(heading, description);
        el.detailSectionList.appendChild(card);
    });
}

function renderPreviewSections() {
    el.previewSectionList.innerHTML = '';

    state.draftSections.forEach((section, index) => {
        const card = document.createElement('article');
        card.className = 'preview-item';
        card.draggable = true;
        card.dataset.index = String(index);

        const dragLabel = document.createElement('div');
        dragLabel.className = 'drag-label';
        dragLabel.textContent = 'Drag to reorder';

        const heading = document.createElement('h4');
        heading.textContent = section.heading;
        applyFont(heading, section.fontStyle);

        const description = document.createElement('p');
        description.textContent = section.description;
        applyFont(description, section.fontStyle);

        card.append(dragLabel, heading, description);

        card.addEventListener('dragstart', e => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.dataset.index);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        card.addEventListener('dragover', e => {
            e.preventDefault();
        });

        card.addEventListener('drop', e => {
            e.preventDefault();
            const sourceIndex = Number(e.dataTransfer.getData('text/plain'));
            const targetIndex = Number(card.dataset.index);
            reorderDraftSections(sourceIndex, targetIndex);
            renderPreviewSections();
        });

        el.previewSectionList.appendChild(card);
    });
}

function renderSavedDetails(sections) {
    el.savedDetailsList.innerHTML = '';

    if (sections.length === 0) {
        el.savedDetailsList.innerHTML = '<p class="car-search-empty">No details saved for this car yet.</p>';
        return;
    }

    sections.forEach(section => {
        const card = document.createElement('article');
        card.className = 'saved-item';

        const heading = document.createElement('h4');
        heading.textContent = section.heading;
        applyFont(heading, section.fontStyle);

        const description = document.createElement('p');
        description.textContent = section.description;
        applyFont(description, section.fontStyle);

        card.append(heading, description);
        el.savedDetailsList.appendChild(card);
    });
}

function reorderDraftSections(sourceIndex, targetIndex) {
    if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) return;

    const moved = state.draftSections[sourceIndex];
    const next = state.draftSections.filter((_, i) => i !== sourceIndex);
    next.splice(targetIndex, 0, moved);
    state.draftSections = next;
}

function validateSectionInputs() {
    const heading = el.detailHeading.value.trim();
    const description = el.detailDescription.value.trim();
    const words = countWords(description);

    if (!heading) return { success: false, message: 'Heading is required.' };
    if (!description) return { success: false, message: 'Description is required.' };
    if (words > 1000) return { success: false, message: 'Description cannot exceed 1000 words.' };

    return { success: true };
}

function updateWordCount() {
    const words = countWords(el.detailDescription.value);
    el.detailWordCount.textContent = `${words} / 1000 words`;
    el.detailWordCount.classList.toggle('limit', words > 1000);
}

function countWords(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
}

function resetDetailForm() {
    el.detailHeading.value = '';
    el.detailDescription.value = '';
    el.detailFontStyle.value = 'inter';
}

function showDetailFormError(message) {
    el.detailFormError.textContent = message;
    el.detailFormError.classList.remove('hidden');
}

function clearDetailFormError() {
    el.detailFormError.textContent = '';
    el.detailFormError.classList.add('hidden');
}

function getCurrentInfoCarId() {
    if (!el.vehicleManagementModule.classList.contains('hidden')) {
        return el.vehicleManagementSelect.value || null;
    }
    return el.carInfoSelect.value || state.selectedInfoCar?.id || null;
}

function getSavedSections(carId) {
    return cloneSections(state.carDetailsByCar[carId] || []);
}

function cloneSections(sections) {
    return sections.map(section => ({ ...section }));
}

function applyFont(element, fontStyle) {
    if (fontStyle === 'serif') element.style.fontFamily = "Georgia, 'Times New Roman', serif";
    else if (fontStyle === 'mono') element.style.fontFamily = "'Courier New', monospace";
    else if (fontStyle === 'classic') element.style.fontFamily = "Cambria, 'Times New Roman', serif";
    else element.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
}

async function syncCarDetailsForCar(carId) {
    if (!carId) {
        return;
    }

    try {
        const sections = await fetchJson(`/api/car-details/${encodeURIComponent(carId)}`);
        state.carDetailsByCar[carId] = Array.isArray(sections) ? sections : [];
    } catch (err) {
        console.error('Load car details failed:', err);
        state.carDetailsByCar[carId] = [];
    }
}

// ─────────────────────────────────────────────
//  Colour application → recolor API
// ─────────────────────────────────────────────
async function applyColor(color) {
    if (!state.selectedCar) {
        alert('Please select a car first!');
        return;
    }

    state.selectedColor = color;
    state.paint.color = color.hex.toUpperCase();
    el.paintColorPicker.value = state.paint.color;
    setStatusLabel(el.selectedColorLabel, '🎨', `${color.name} (${color.hex})`);

    pushRecent(color);
    renderRecent();
    renderColorList(state.filteredColors.slice(0, 1000));

    el.recolorLoader.classList.remove('hidden');

    try {
        const response = await fetch('/api/recolor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ carId: state.selectedCar.id, hexColor: color.hex })
        });

        const result = await response.json();

        if (result.success) {
            const imageUrl = `${result.imageUrl}?v=${Date.now()}`;
            el.recoloredImage.src = imageUrl;
            el.sliderRecolored.src = imageUrl;
            el.downloadRecoloredBtn.disabled = false;
        } else {
            alert(result.message || 'Recolor failed.');
        }
    } catch (err) {
        console.error('Recolor failed:', err);
    } finally {
        el.recolorLoader.classList.add('hidden');
    }
}

// ─────────────────────────────────────────────
//  Category filter
// ─────────────────────────────────────────────
function renderCategoryFilter(colors) {
    const categories = [...new Set(colors.map(c => c.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        el.categoryFilter.appendChild(option);
    });
}

function applyColorFilter() {
    const term = el.colorSearch.value.trim().toLowerCase();
    const category = el.categoryFilter.value;

    state.filteredColors = state.colors.filter(c => {
        const matchesTerm = !term || c.name.toLowerCase().includes(term) || c.hex.toLowerCase().includes(term);
        const matchesCategory = !category || c.category === category;
        return matchesTerm && matchesCategory;
    });

    renderColorList(state.filteredColors.slice(0, 1000));
}

// ─────────────────────────────────────────────
//  Colour list rendering
// ─────────────────────────────────────────────
function renderColorList(colors) {
    el.colorList.innerHTML = '';

    if (colors.length === 0) {
        el.colorList.innerHTML = '<p class="no-results">No colours found</p>';
        return;
    }

    colors.forEach(color => {
        const row = document.createElement('div');
        row.className = `color-item${state.selectedColor?.hex === color.hex ? ' active' : ''}`;
        row.setAttribute('role', 'listitem');

        const swatch = document.createElement('span');
        swatch.className = 'swatch';
        swatch.style.background = color.hex;
        swatch.style.boxShadow = `0 0 0 2px rgba(0,0,0,.08), inset 0 0 0 1px rgba(255,255,255,.2)`;

        const label = document.createElement('span');
        label.className = 'color-label';
        label.textContent = `${color.name}`;

        const hex = document.createElement('span');
        hex.className = 'color-hex';
        hex.textContent = color.hex;

        row.append(swatch, label, hex);
        row.addEventListener('click', () => applyColor(color));

        el.colorList.appendChild(row);
    });
}

// ─────────────────────────────────────────────
//  Recently used
// ─────────────────────────────────────────────
function renderRecent() {
    el.recentColors.innerHTML = '';

    if (state.recent.length === 0) {
        el.recentColors.innerHTML = '<span class="no-recent">None yet</span>';
        return;
    }

    state.recent.forEach(item => {
        const chip = document.createElement('button');
        chip.className = 'recent-chip';
        chip.title = `${item.name} (${item.hex})`;
        chip.style.background = item.hex;
        chip.setAttribute('aria-label', `Apply colour ${item.name}`);
        chip.addEventListener('click', () => applyColor(item));
        el.recentColors.appendChild(chip);
    });
}

function pushRecent(color) {
    const n = { name: color.name, hex: color.hex.toUpperCase(), category: color.category || 'Custom' };
    state.recent = [n, ...state.recent.filter(c => c.hex !== n.hex)].slice(0, MAX_RECENT);
    localStorage.setItem('recentColors', JSON.stringify(state.recent));
}

function loadRecent() {
    try {
        const v = localStorage.getItem('recentColors');
        return v ? JSON.parse(v) : [];
    } catch {
        return [];
    }
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function setupPaintCanvas() {
    const canvas = el.paintCanvas;

    canvas.addEventListener('pointerdown', startPaint);
    canvas.addEventListener('pointermove', movePaint);
    canvas.addEventListener('pointerup', stopPaint);
    canvas.addEventListener('pointerleave', stopPaint);

    state.paint.size = Number(el.paintSizeRange.value);
    state.paint.color = el.paintColorPicker.value.toUpperCase();
    setPaintTool('brush');
    resizePaintCanvas();
}

function resizePaintCanvas() {
    const canvas = el.paintCanvas;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
}

function setPaintTool(tool) {
    state.paint.tool = tool;
    el.paintBrushBtn.classList.toggle('active', tool === 'brush');
    el.eraseBrushBtn.classList.toggle('active', tool === 'eraser');
    el.paintCanvas.style.cursor = tool === 'eraser' ? 'cell' : 'crosshair';
}

function startPaint(event) {
    event.preventDefault();
    state.paint.isDrawing = true;
    const point = getPaintPoint(event);
    state.paint.lastX = point.x;
    state.paint.lastY = point.y;
}

function movePaint(event) {
    if (!state.paint.isDrawing) {
        return;
    }

    event.preventDefault();

    const ctx = el.paintCanvas.getContext('2d');
    const point = getPaintPoint(event);

    ctx.save();
    ctx.lineWidth = state.paint.size;

    if (state.paint.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = state.paint.color;
    }

    ctx.beginPath();
    ctx.moveTo(state.paint.lastX, state.paint.lastY);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.restore();

    state.paint.lastX = point.x;
    state.paint.lastY = point.y;
}

function stopPaint() {
    state.paint.isDrawing = false;
}

function clearPaintCanvas() {
    const canvas = el.paintCanvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getPaintPoint(event) {
    const rect = el.paintCanvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

async function downloadRecoloredImage() {
    if (!state.selectedCar || !state.selectedColor) {
        alert('Please recolor a car first.');
        return;
    }

    const imageUrl = el.recoloredImage.src;
    if (!imageUrl) {
        alert('No recolored image available to download.');
        return;
    }

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error('Failed to download image.');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const colorHex = state.selectedColor.hex.replace('#', '').toLowerCase();

        link.href = objectUrl;
        link.download = `${state.selectedCar.id}-${colorHex}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
    } catch (err) {
        console.error('Download failed:', err);
        alert('Unable to download recolored image. Please try again.');
    }
}

function setStatusLabel(element, icon, text) {
    element.innerHTML = `<span class="status-icon">${icon}</span><span>${text}</span>`;
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${url}`);
    return response.json();
}

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ─────────────────────────────────────────────
//  User Management & Admin panel functions
// ─────────────────────────────────────────────
async function loadUsers() {
    try {
        const users = await fetchJson('/api/users');
        state.users = users;
        applyUserFilter();
        populateMailUserDropdown(users);
    } catch (err) {
        console.error('Failed to load users:', err);
    }
}

function populateMailUserDropdown(users) {
    if (!el.mailUserSelect) return;

    while (el.mailUserSelect.options.length > 1) {
        el.mailUserSelect.remove(1);
    }

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.email;
        option.dataset.username = user.username;
        option.textContent = `${user.username} (${user.email})`;
        el.mailUserSelect.appendChild(option);
    });
}

async function handleMailDesignClick() {
    const selectedEmail = el.mailUserSelect.value;
    if (!selectedEmail) return;

    if (!state.selectedCar) {
        alert('Please select a car first!');
        return;
    }

    const originalUrl = el.originalImage.src;
    const recoloredUrl = el.recoloredImage.src;

    if (!originalUrl || !recoloredUrl) {
        alert('Please recolor the car first to generate the designs.');
        return;
    }

    const selectedOption = el.mailUserSelect.options[el.mailUserSelect.selectedIndex];
    const username = selectedOption.dataset.username || 'User';

    const carName = `${state.selectedCar.brand} ${state.selectedCar.model}`;
    const colorName = state.selectedColor ? `${state.selectedColor.name} (${state.selectedColor.hex})` : 'Custom Paint';
    const colorHex = state.selectedColor ? state.selectedColor.hex.replace('#', '').toLowerCase() : 'custom';

    const originalExt = originalUrl.split('.').pop().split('?')[0] || 'png';
    const originalFilename = `${state.selectedCar.id}-original.${originalExt}`;
    const recoloredFilename = `${state.selectedCar.id}-${colorHex}.png`;

    // 1. Set loading statuses in modal
    if (el.originalDownloadStatus) el.originalDownloadStatus.innerHTML = '⏳';
    if (el.recoloredDownloadStatus) el.recoloredDownloadStatus.innerHTML = '⏳';
    if (el.clipboardStatusIcon) el.clipboardStatusIcon.innerHTML = '⏳';
    if (el.clipboardStatusText) el.clipboardStatusText.textContent = 'Copying to clipboard...';
    if (el.originalDownloadName) el.originalDownloadName.textContent = `${originalFilename} (Downloading...)`;
    if (el.recoloredDownloadName) el.recoloredDownloadName.textContent = `${recoloredFilename} (Downloading...)`;

    // Show the helper modal overlay immediately
    if (el.mailAttachmentModal) {
        el.mailAttachmentModal.classList.remove('hidden');
    }

    // Prepare Gmail URL
    const subject = encodeURIComponent(`Car Design Details - ${carName}`);
    const body = encodeURIComponent(`Hi ${username},\n\nI have generated a custom recoloured car design in CarColourStudio for you!\n\nCar Model: ${carName}\nSelected Paint: ${colorName}\n\nI have downloaded both the original and recoloured car designs for you, and the recoloured image is copied to your clipboard. You can press Ctrl+V to paste the recoloured design here, or drag-and-drop the downloaded files (original and recoloured images) directly into this draft!\n\nBest regards,\nCarColourStudio`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${selectedEmail}&su=${subject}&body=${body}`;

    // Set up open Gmail button click action in the modal
    if (el.openGmailDraftBtn) {
        el.openGmailDraftBtn.onclick = () => {
            window.open(gmailUrl, '_blank');
        };
    }

    // 2. Perform original image download
    let originalSuccess = false;
    try {
        const response = await fetch(originalUrl);
        if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = originalFilename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(objectUrl);
            originalSuccess = true;
        }
    } catch (err) {
        console.error('Failed to download original image:', err);
    }

    if (el.originalDownloadStatus) {
        el.originalDownloadStatus.innerHTML = originalSuccess ? '✅' : '❌';
        el.originalDownloadStatus.style.color = originalSuccess ? '#00ff66' : '#ff3b30';
    }
    if (el.originalDownloadName) {
        el.originalDownloadName.textContent = originalSuccess ? `${originalFilename} (Downloaded successfully)` : `${originalFilename} (Download failed)`;
    }

    // 3. Perform recoloured image download
    let recoloredSuccess = false;
    try {
        const response = await fetch(recoloredUrl);
        if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = recoloredFilename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(objectUrl);
            recoloredSuccess = true;
        }
    } catch (err) {
        console.error('Failed to download recoloured image:', err);
    }

    if (el.recoloredDownloadStatus) {
        el.recoloredDownloadStatus.innerHTML = recoloredSuccess ? '✅' : '❌';
        el.recoloredDownloadStatus.style.color = recoloredSuccess ? '#00ff66' : '#ff3b30';
    }
    if (el.recoloredDownloadName) {
        el.recoloredDownloadName.textContent = recoloredSuccess ? `${recoloredFilename} (Downloaded successfully)` : `${recoloredFilename} (Download failed)`;
    }

    // 4. Perform clipboard copy of recoloured image
    let clipboardSuccess = false;
    try {
        const response = await fetch(recoloredUrl);
        if (response.ok) {
            const blob = await response.blob();
            const pngBlob = blob.type === 'image/png' ? blob : new Blob([blob], { type: 'image/png' });
            const item = new ClipboardItem({ 'image/png': pngBlob });
            await navigator.clipboard.write([item]);
            clipboardSuccess = true;
        }
    } catch (err) {
        console.warn('Failed to copy recoloured image to clipboard:', err);
    }

    if (el.clipboardStatusIcon) {
        el.clipboardStatusIcon.innerHTML = clipboardSuccess ? '✅' : '⚠️';
        el.clipboardStatusIcon.style.color = clipboardSuccess ? '#00ff66' : '#ffcc00';
    }
    if (el.clipboardStatusText) {
        el.clipboardStatusText.textContent = clipboardSuccess
            ? 'Copied recoloured image to clipboard!'
            : 'Could not copy to clipboard automatically (unsupported or blocked).';
    }

    // 5. Open Gmail compose window automatically
    window.open(gmailUrl, '_blank');
}

function closeMailAttachmentModal() {
    if (el.mailAttachmentModal) {
        el.mailAttachmentModal.classList.add('hidden');
    }
}

function updateMailButtonState() {
    if (el.mailDesignBtn && el.mailUserSelect) {
        el.mailDesignBtn.disabled = !el.mailUserSelect.value;
    }
}

function renderUserGrid() {
    if (!el.userGridBody) return;
    el.userGridBody.innerHTML = '';
    const filtered = state.filteredUsers;

    if (filtered.length === 0) {
        if (el.userGridEmpty) el.userGridEmpty.classList.remove('hidden');
        return;
    }

    if (el.userGridEmpty) el.userGridEmpty.classList.add('hidden');
    filtered.forEach(user => {
        const row = document.createElement('tr');

        const usernameTd = document.createElement('td');
        usernameTd.textContent = user.username;
        usernameTd.style.fontWeight = '600';

        const emailTd = document.createElement('td');
        emailTd.textContent = user.email;

        const passwordTd = document.createElement('td');
        passwordTd.className = 'user-grid-pw';
        passwordTd.textContent = '••••••••';
        passwordTd.title = 'Password is encrypted';

        const actionsTd = document.createElement('td');
        actionsTd.className = 'grid-actions';

        const viewBtn = document.createElement('button');
        viewBtn.type = 'button';
        viewBtn.className = 'btn-secondary';
        viewBtn.textContent = '👁 View';
        viewBtn.addEventListener('click', () => handleViewUserClick(user.id));

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn-secondary';
        editBtn.textContent = '✏ Edit';
        editBtn.addEventListener('click', () => handleEditUserClick(user.id));

        actionsTd.append(viewBtn, editBtn);

        const isSuperAdmin = user.email.toLowerCase() === 'jojogeorge3344@gmail.com';
        if (!isSuperAdmin) {
            const authBtn = document.createElement('button');
            authBtn.type = 'button';
            authBtn.className = 'btn-secondary';
            authBtn.textContent = '🔑 Auth';
            authBtn.addEventListener('click', () => handleUserAuthorizationClick(user));

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'btn-danger';
            deleteBtn.textContent = '🗑 Delete';
            deleteBtn.addEventListener('click', () => handleDeleteUserClick(user.id));

            actionsTd.append(authBtn, deleteBtn);
        }

        row.append(usernameTd, emailTd, passwordTd, actionsTd);
        el.userGridBody.appendChild(row);
    });
}

function applyUserFilter() {
    if (!el.userSearch) return;
    const term = el.userSearch.value.trim().toLowerCase();
    if (!term) {
        state.filteredUsers = [...state.users];
    } else {
        state.filteredUsers = state.users.filter(user =>
            user.username.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        );
    }

    if (state.userSortDirection === 'asc') {
        state.filteredUsers.sort((a, b) => a.username.localeCompare(b.username));
    } else if (state.userSortDirection === 'desc') {
        state.filteredUsers.sort((a, b) => b.username.localeCompare(a.username));
    }

    renderUserGrid();
}

async function handleAddUser(event) {
    event.preventDefault();
    const username = el.newUsername.value.trim();
    const email = el.newEmail.value.trim();
    const password = el.newPassword.value;

    if (!username || !email || !password) {
        setAddUserFeedback('All fields are required.', true);
        return;
    }

    el.addUserSubmitBtn.disabled = true;
    setAddUserFeedback('Registering user...', false);

    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        if (el.newProfilePic && el.newProfilePic.files && el.newProfilePic.files[0]) {
            formData.append('profilePic', el.newProfilePic.files[0]);
        }

        const response = await fetch('/api/users', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Registration failed.');
        }

        setAddUserFeedback('User created successfully!', false);
        showCinematicToast(username, 'add');
        el.newUsername.value = '';
        el.newEmail.value = '';
        el.newPassword.value = '';
        if (el.newProfilePic) el.newProfilePic.value = '';

        await loadUsers();
        await refreshValidEmails();
    } catch (err) {
        console.error('Add user failed:', err);
        setAddUserFeedback(err.message || 'Failed to create user. Email may already be in use.', true);
    } finally {
        el.addUserSubmitBtn.disabled = false;
    }
}

function setAddUserFeedback(message, isError) {
    if (!el.addUserFeedback) return;
    el.addUserFeedback.textContent = message;
    el.addUserFeedback.classList.remove('hidden', 'error', 'success');
    el.addUserFeedback.classList.add(isError ? 'error' : 'success');
}

function handleEditUserClick(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;

    el.editUserId.value = user.id;
    el.editUsername.value = user.username;
    el.editEmail.value = user.email;
    el.editPassword.value = user.password;

    setEditUserFeedback('', false, true);
    el.editUserModal.classList.remove('hidden');
}

function closeEditUserModal() {
    if (el.editUserModal) el.editUserModal.classList.add('hidden');
}

async function handleEditUserSubmit(event) {
    event.preventDefault();
    const id = el.editUserId.value;
    const username = el.editUsername.value.trim();
    const email = el.editEmail.value.trim();
    const password = el.editPassword.value;

    if (!username || !email || !password) {
        setEditUserFeedback('All fields are required.', true);
        return;
    }

    el.saveEditUserBtn.disabled = true;
    setEditUserFeedback('Saving changes...', false);

    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        if (el.editProfilePic && el.editProfilePic.files && el.editProfilePic.files[0]) {
            formData.append('profilePic', el.editProfilePic.files[0]);
        }

        const response = await fetch(`/api/users/${encodeURIComponent(id)}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Update failed.');
        }

        const updatedUser = await response.json();

        const originalUser = state.users.find(u => u.id === id);
        if (state.currentUser && originalUser && originalUser.email === state.currentUser.email) {
            state.currentUser = {
                username: updatedUser.username,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic
            };
            localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
            renderCurrentUserHeader();
        }

        if (el.editProfilePic) el.editProfilePic.value = '';

        await loadUsers();
        await refreshValidEmails();
        closeEditUserModal();
        showCinematicToast(username, 'update');
    } catch (err) {
        console.error('Edit user failed:', err);
        setEditUserFeedback(err.message || 'Failed to update user. Email may be in use.', true);
    } finally {
        el.saveEditUserBtn.disabled = false;
    }
}

function setEditUserFeedback(message, isError, hide = false) {
    if (!el.editUserFeedback) return;
    if (hide) {
        el.editUserFeedback.textContent = '';
        el.editUserFeedback.classList.add('hidden');
        el.editUserFeedback.classList.remove('error', 'success');
        return;
    }
    el.editUserFeedback.textContent = message;
    el.editUserFeedback.classList.remove('hidden', 'error', 'success');
    el.editUserFeedback.classList.add(isError ? 'error' : 'success');
}

function handleUserAuthorizationClick(user) {
    if (!user) return;
    el.authUserId.value = user.id;
    if (el.authUserDisplay) el.authUserDisplay.textContent = `${user.username} (${user.email})`;

    const disabled = user.disabledModules || [];
    el.authRecolor.checked = !disabled.includes('recolor');
    el.authCarInfo.checked = !disabled.includes('carInfo');
    el.authVehicleManagement.checked = !disabled.includes('vehicleManagement');
    el.authAdmin.checked = !disabled.includes('admin');

    setUserAuthFeedback('', false, true);
    if (el.userAuthModal) el.userAuthModal.classList.remove('hidden');
}

function closeUserAuthModal() {
    if (el.userAuthModal) el.userAuthModal.classList.add('hidden');
}

async function handleSaveUserAuthClick() {
    const id = el.authUserId.value;
    if (!id) return;

    const userToAuth = state.users.find(u => u.id === id);
    const username = userToAuth ? userToAuth.username : 'Unknown User';

    const disabledModules = [];
    if (!el.authRecolor.checked) disabledModules.push('recolor');
    if (!el.authCarInfo.checked) disabledModules.push('carInfo');
    if (!el.authVehicleManagement.checked) disabledModules.push('vehicleManagement');
    if (!el.authAdmin.checked) disabledModules.push('admin');

    el.saveUserAuthBtn.disabled = true;
    setUserAuthFeedback('Saving changes...', false);

    try {
        const response = await fetch(`/api/users/${encodeURIComponent(id)}/authorization`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(disabledModules)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to save authorization settings.');
        }

        await loadUsers();

        const originalUser = state.users.find(u => u.id === id);
        if (state.currentUser && originalUser && originalUser.email === state.currentUser.email) {
            state.currentUser.disabledModules = disabledModules;
            localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
            applyUserAuthorization(state.currentUser);
        }

        setUserAuthFeedback('Authorization settings updated successfully.', false);
        showCinematicToast(username, 'auth');
        setTimeout(closeUserAuthModal, 1000);
    } catch (err) {
        console.error('Save user auth failed:', err);
        setUserAuthFeedback(err.message || 'Failed to update authorization settings.', true);
    } finally {
        el.saveUserAuthBtn.disabled = false;
    }
}

function setUserAuthFeedback(message, isError, hide = false) {
    if (!el.userAuthFeedback) return;
    if (hide) {
        el.userAuthFeedback.textContent = '';
        el.userAuthFeedback.classList.add('hidden');
        el.userAuthFeedback.classList.remove('error', 'success');
        return;
    }
    el.userAuthFeedback.textContent = message;
    el.userAuthFeedback.classList.remove('hidden', 'error', 'success');
    el.userAuthFeedback.classList.add(isError ? 'error' : 'success');
}

function handleDeleteUserClick(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;

    state.selectedUser = user;
    if (el.deleteUserTargetName) el.deleteUserTargetName.textContent = `${user.username} (${user.email})`;
    if (el.deleteUserModal) el.deleteUserModal.classList.remove('hidden');
}

function closeDeleteUserModal() {
    if (el.deleteUserModal) el.deleteUserModal.classList.add('hidden');
    state.selectedUser = null;
}

async function handleConfirmDeleteUser() {
    const user = state.selectedUser;
    if (!user) return;

    const username = user.username;
    el.confirmDeleteUserBtn.disabled = true;

    try {
        const response = await fetch(`/api/users/${encodeURIComponent(user.id)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete user.');
        }

        await loadUsers();
        await refreshValidEmails();
        closeDeleteUserModal();
        showCinematicToast(username, 'delete');
    } catch (err) {
        console.error('Delete user failed:', err);
        alert(err.message || 'Failed to delete user.');
    } finally {
        if (el.confirmDeleteUserBtn) el.confirmDeleteUserBtn.disabled = false;
    }
}

// ─────────────────────────────────────────────
//  3D Cinematic Viewport Window
// ─────────────────────────────────────────────
let cinematicInterval = null;

function handleViewUserClick(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;

    if (el.viewUsernameVal) el.viewUsernameVal.textContent = user.username;
    if (el.viewEmailVal) el.viewEmailVal.textContent = user.email;
    if (el.viewIdVal) el.viewIdVal.textContent = user.id;

    // Set user's profile picture inside the cinematic showroom
    if (el.cinematicCarImage) {
        el.cinematicCarImage.src = user.profilePic ? `/${user.profilePic}` : '/images/default_avatar.png';
        el.cinematicCarImage.style.borderRadius = '50%';
        el.cinematicCarImage.style.objectFit = 'cover';
        el.cinematicCarImage.style.width = '140px';
        el.cinematicCarImage.style.height = '140px';
    }

    // Reset cinematic state
    state.cinematic.mode = 'pulse';
    state.cinematic.color = '#FF2800';
    state.cinematic.rotation = 0;

    if (el.cinematicColorText) el.cinematicColorText.textContent = '#FF2800';
    if (el.cinematicRotationText) el.cinematicRotationText.textContent = '0° Y';

    // Active class updates on showroom style buttons
    updateCinematicControls();

    // Set first swatch active
    if (el.cinematicSwatches) {
        [...el.cinematicSwatches.children].forEach(sw => {
            sw.classList.toggle('active', sw.dataset.hex === '#FF2800');
        });
    }

    applyCinematicAnimation();
    if (el.viewUserModal) el.viewUserModal.classList.remove('hidden');
}

function closeViewUserModal() {
    if (el.viewUserModal) el.viewUserModal.classList.add('hidden');
    stopCinematicLoop();
}

function setCinematicMode(mode) {
    state.cinematic.mode = mode;
    updateCinematicControls();
    applyCinematicAnimation();
}

function updateCinematicControls() {
    if (el.cinematicModePulse) el.cinematicModePulse.classList.toggle('active', state.cinematic.mode === 'pulse');
    if (el.cinematicModeDrift) el.cinematicModeDrift.classList.toggle('active', state.cinematic.mode === 'drift');
    if (el.cinematicModeCyber) el.cinematicModeCyber.classList.toggle('active', state.cinematic.mode === 'cyber');
}

function applyCinematicAnimation() {
    stopCinematicLoop();

    const carWrap = el.cinematicCarWrap;
    const carImg = el.cinematicCarImage;
    const glow = el.cinematicGlow;
    const scanner = el.cinematicScanner;

    if (!carWrap || !carImg) return;

    // Clear styles
    carWrap.className = 'cinematic-car-wrap';
    carWrap.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    carImg.className = 'cinematic-car-img';
    if (scanner) scanner.style.display = 'none';

    if (state.cinematic.mode === 'pulse') {
        carImg.classList.add('pulse-anim');
        updateCarColorFilter(state.cinematic.color);
    } else if (state.cinematic.mode === 'drift') {
        carWrap.classList.add('drift-anim');
        updateCarColorFilter(state.cinematic.color);
    } else if (state.cinematic.mode === 'cyber') {
        if (scanner) scanner.style.display = 'block';

        let hue = 0;
        cinematicInterval = setInterval(() => {
            hue = (hue + 2) % 360;
            carImg.style.filter = `drop-shadow(0px 15px 20px rgba(0, 0, 0, 0.9)) hue-rotate(${hue}deg) brightness(1.2)`;
            if (glow) glow.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 50%, 0.25) 0%, transparent 70%)`;
            if (el.cinematicColorText) {
                el.cinematicColorText.textContent = `HUE: ${hue}°`;
            }
        }, 35);
    }
}

function stopCinematicLoop() {
    if (cinematicInterval) {
        clearInterval(cinematicInterval);
        cinematicInterval = null;
    }
}

function setCinematicColor(hex, swatchEl) {
    if (state.cinematic.mode === 'cyber') return; // Cyber scan cycles automatically

    state.cinematic.color = hex;

    // Update active swatch
    if (el.cinematicSwatches) {
        [...el.cinematicSwatches.children].forEach(sw => {
            sw.classList.toggle('active', sw === swatchEl);
        });
    }

    if (el.cinematicColorText) el.cinematicColorText.textContent = hex;
    updateCarColorFilter(hex);
}

function updateCarColorFilter(hex) {
    const carImg = el.cinematicCarImage;
    const glow = el.cinematicGlow;
    if (!carImg) return;

    let hueRotate = 0;
    switch (hex) {
        case '#FF2800': hueRotate = 0; break;
        case '#00FFCC': hueRotate = 130; break;
        case '#FF00FF': hueRotate = 280; break;
        case '#FFFF00': hueRotate = 45; break;
        case '#00FF00': hueRotate = 80; break;
        case '#0066FF': hueRotate = 185; break;
        default: hueRotate = 0;
    }

    carImg.style.filter = `drop-shadow(0px 15px 20px rgba(0, 0, 0, 0.9)) hue-rotate(${hueRotate}deg) saturate(1.5)`;
    if (glow) glow.style.background = `radial-gradient(circle, ${hex}33 0%, transparent 70%)`;
}

function handleCinematicMouseMove(e) {
    const wrap = el.cinematicCarWrap;
    if (!wrap || state.cinematic.mode === 'drift') return;

    const rect = el.cinematicWindow.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 20;
    const rotateX = -((y - centerY) / centerY) * 15;

    wrap.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;

    if (el.cinematicRotationText) {
        el.cinematicRotationText.textContent = `${Math.round(rotateY)}° Y, ${Math.round(rotateX)}° X`;
    }
}

function resetCinematicPerspective() {
    const wrap = el.cinematicCarWrap;
    if (!wrap || state.cinematic.mode === 'drift') return;

    wrap.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    if (el.cinematicRotationText) {
        el.cinematicRotationText.textContent = '0° Y, 0° X';
    }
}

// ─────────────────────────────────────────────
//  Cinematic Toasts Support
// ─────────────────────────────────────────────
function getOrCreateToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    return container;
}

function showCinematicToast(username, actionType) {
    const container = getOrCreateToastContainer();

    const toast = document.createElement('div');
    toast.className = `cinematic-toast toast-${actionType} cinematic-toast-entrance`;

    let iconHtml = '';
    let badgeText = '';

    switch (actionType) {
        case 'add':
            badgeText = 'Successfully Added';
            iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>`;
            break;
        case 'update':
            badgeText = 'Successfully Updated';
            iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
            break;
        case 'delete':
            badgeText = 'Successfully Deleted';
            iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
            break;
        case 'auth':
            badgeText = 'Authorization Done';
            iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`;
            break;
    }

    toast.innerHTML = `
        <div class="cinematic-toast-scanline"></div>
        <div class="cinematic-toast-glow"></div>
        <div class="cinematic-toast-inner">
            <div class="cinematic-toast-icon">
                ${iconHtml}
            </div>
            <div class="cinematic-toast-content">
                <div class="cinematic-toast-badge">${badgeText}</div>
                <div class="cinematic-toast-username">${username}</div>
            </div>
            <button class="cinematic-toast-close">&times;</button>
        </div>
    `;

    const closeBtn = toast.querySelector('.cinematic-toast-close');
    closeBtn.addEventListener('click', () => {
        dismissToast(toast);
    });

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            dismissToast(toast);
        }
    }, 4000);
}

function dismissToast(toast) {
    toast.classList.remove('cinematic-toast-entrance');
    toast.classList.add('cinematic-toast-exit');
    let removed = false;
    const removeFn = () => {
        if (!removed) {
            removed = true;
            toast.remove();
        }
    };
    toast.addEventListener('animationend', (e) => {
        if (e.animationName === 'cinematicExit') {
            removeFn();
        }
    });
    setTimeout(removeFn, 600);
}
