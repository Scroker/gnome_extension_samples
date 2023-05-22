const {Gio, GObject} = imports.gi;
const QuickSettings = imports.ui.quickSettings;
const ExtensionUtils = imports.misc.extensionUtils;
const QuickSettingsMenu = imports.ui.main.panel.statusArea.quickSettings;

const FeatureSlider = GObject.registerClass(
class FeatureSlider extends QuickSettings.QuickSlider {
    _init() {
        super._init({
            iconName: 'selection-mode-symbolic',
        });
        
        this._sliderChangedId = this.slider.connect('notify::value',
            this._onSliderChanged.bind(this));

        // Binding the slider to a GSettings key
        this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.example');
        
        this._settings.connect('changed::feature-range',
            this._onSettingsChanged.bind(this));

        this._onSettingsChanged();
        
        // Set an accessible name for the slider
        this.slider.accessible_name = 'Feature Range';
    }
    
    _onSettingsChanged() {
        // Prevent the slider from emitting a change signal while being updated
        this.slider.block_signal_handler(this._sliderChangedId);
        this.slider.value = this._settings.get_uint('feature-range') / 100.0;
        this.slider.unblock_signal_handler(this._sliderChangedId);
    }
    
    _onSliderChanged() {
        // Assuming our GSettings holds values between 0..100, adjust for the
        // slider taking values between 0..1
        const percent = Math.floor(this.slider.value * 100);
        this._settings.set_uint('feature-range', percent);
    }
});

const FeatureIndicator = GObject.registerClass(
class FeatureIndicator extends QuickSettings.SystemIndicator {
    _init() {
        super._init();
        
        // Create the slider and associate it with the indicator, being sure to
        // destroy it along with the indicator
        this.quickSettingsItems.push(new FeatureSlider());
        
        this.connect('destroy', () => {
            this.quickSettingsItems.forEach(item => item.destroy());
        });

        // Add the indicator to the panel
        QuickSettingsMenu._indicators.add_child(this);
        
        // Add the slider to the menu, this time passing `2` as the second
        // argument to ensure the slider spans both columns of the menu
        QuickSettingsMenu._addItems(this.quickSettingsItems, 2);
    }
});

var featureIndicator = null;
   
function init() {}

function enable() {
    featureIndicator = new FeatureIndicator();
}

function disable() {
    featureIndicator.destroy()
    featureIndicator = null
}