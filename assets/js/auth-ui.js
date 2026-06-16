document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-password-toggle]').forEach((btn) => {
        const id = btn.getAttribute('data-password-toggle');
        const input = document.getElementById(id);
        if (!input) return;
        btn.addEventListener('click', () => {
            const show = input.getAttribute('type') === 'password';
            input.setAttribute('type', show ? 'text' : 'password');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', show ? 'eye-off' : 'eye');
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
            }
        });
    });
});
