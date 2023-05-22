const {Gio, GObject} = imports.gi;

const QuickSettings = imports.ui.quickSettings;

// This is the live instance of the Quick Settings menu
const QuickSettingsMenu = imports.ui.main.panel.statusArea.quickSettings;
// This is the live instance of the System Item
const SystemItem = QuickSettingsMenu._system._indicator;


const FeatureButton = GObject.registerClass(
class FeatureButton extends QuickSettings.QuickSettingsItem {
    _init() {
        super._init({
            style_class: 'icon-button',
            can_focus: true,
            icon_name: 'selection-mode-symbolic',
            accessible_name: 'Feature',
        });

        this.connect('clicked', () => log('activated'));
    }
});

SystemItem.child.add_child(new FeatureButton());