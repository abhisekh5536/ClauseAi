const { BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('node:path');

function createWindow(sendToRenderer) {
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        frame: false,
        transparent: true,
        hasShadow: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
        },
        backgroundColor: '#00000000',
    });

    mainWindow.setResizable(false);
    mainWindow.setContentProtection(true);
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    // Center window at the top of the screen
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth } = primaryDisplay.workAreaSize;
    const x = Math.floor((screenWidth - 600) / 2);
    const y = 50;
    mainWindow.setPosition(x, y);

    if (process.platform === 'win32') {
        mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    }

    mainWindow.loadFile(path.join(__dirname, '../index.html'));

    // Set up basic keyboard shortcuts
    setupKeyboardShortcuts(mainWindow, sendToRenderer);
    setupWindowIpcHandlers(mainWindow);

    return mainWindow;
}

function setupKeyboardShortcuts(mainWindow, sendToRenderer) {
    const isMac = process.platform === 'darwin';
    
    // Window visibility toggle
    const toggleVisibility = isMac ? 'Cmd+\\' : 'Ctrl+\\';
    globalShortcut.register(toggleVisibility, () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.showInactive();
        }
    });

    // Window movement
    const moveIncrement = 50;
    
    globalShortcut.register(isMac ? 'Alt+Up' : 'Ctrl+Up', () => {
        if (!mainWindow.isVisible()) return;
        const [currentX, currentY] = mainWindow.getPosition();
        mainWindow.setPosition(currentX, Math.max(0, currentY - moveIncrement));
    });

    globalShortcut.register(isMac ? 'Alt+Down' : 'Ctrl+Down', () => {
        if (!mainWindow.isVisible()) return;
        const [currentX, currentY] = mainWindow.getPosition();
        mainWindow.setPosition(currentX, currentY + moveIncrement);
    });

    globalShortcut.register(isMac ? 'Alt+Left' : 'Ctrl+Left', () => {
        if (!mainWindow.isVisible()) return;
        const [currentX, currentY] = mainWindow.getPosition();
        mainWindow.setPosition(Math.max(0, currentX - moveIncrement), currentY);
    });

    globalShortcut.register(isMac ? 'Alt+Right' : 'Ctrl+Right', () => {
        if (!mainWindow.isVisible()) return;
        const [currentX, currentY] = mainWindow.getPosition();
        mainWindow.setPosition(currentX + moveIncrement, currentY);
    });

    // Click-through toggle
    let mouseEventsIgnored = false;
    globalShortcut.register(isMac ? 'Cmd+M' : 'Ctrl+M', () => {
        mouseEventsIgnored = !mouseEventsIgnored;
        if (mouseEventsIgnored) {
            mainWindow.setIgnoreMouseEvents(true, { forward: true });
            console.log('Mouse events ignored');
        } else {
            mainWindow.setIgnoreMouseEvents(false);
            console.log('Mouse events enabled');
        }
    });
}

function setupWindowIpcHandlers(mainWindow) {
    ipcMain.handle('window-minimize', () => {
        if (!mainWindow.isDestroyed()) {
            mainWindow.minimize();
        }
    });

    ipcMain.handle('toggle-window-visibility', async () => {
        try {
            if (mainWindow.isDestroyed()) {
                return { success: false, error: 'Window has been destroyed' };
            }

            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow.showInactive();
            }
            return { success: true };
        } catch (error) {
            console.error('Error toggling window visibility:', error);
            return { success: false, error: error.message };
        }
    });
}

module.exports = {
    createWindow,
    setupKeyboardShortcuts,
    setupWindowIpcHandlers,
};