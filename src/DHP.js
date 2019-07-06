import * as dat from 'dat.gui';
import Preset from './Preset';

/** ParameterCallback
 * @callback ParameterCallback
 * @param {any} value
 */

/** @type {dat.GUI} */
let _gui;
/** @type {Object.<string, dat.GUIController>} */
const _guiControllers = {};

const _controller = {};

let _shown = false;
let _comboIndex = 0;

function add(key)
{
    if(_guiControllers[key])
    {
        _guiControllers[key].remove();
    }
    _guiControllers[key] = DHP.gui.add(_controller, key);
}

function loadPresets()
{
    let untitledPreset = 0;
    const presetsFolder = DHP.gui.addFolder('Presets');
    
    const insertPreset = preset => {
        const keys = Object.keys(preset.data);
        if(keys.every(key => _controller.hasOwnProperty(key)))
        {
            const guiName = 'Load \'' + (preset.name || (++untitledPreset)) + '\'';
            const presetController = {};
            presetController[guiName] = () => {
                keys.forEach(key => _controller[key] = preset.data[key]);
                for(const c in _guiControllers){
                    _guiControllers[c].updateDisplay();
                }
            };
            presets.controllers[preset.name] = presetsFolder.add(presetController, guiName);
        }
    };

    const presets = {
        New: 'Main',
        Save: () => {
            if(presets.New.length > 0)
            {
                if(presets.controllers[presets.New])
                {
                    if(confirm('Are you sure you want to overwrite preset: \'' + presets.New + '\'?'))
                    {
                        presets.controllers[presets.New].remove();
                    }
                    else
                    {
                        return;
                    }
                }
                const preset = new Preset(presets.New);
                preset.data = Preset.Flatten(_controller);
                preset.Save('presets/' + presets.New);
                insertPreset(preset);
            }
            else{
                alert('Preset should have a name');
            }
        },
        controllers: {}
    };
    
    presetsFolder.add(presets, 'New');
    presetsFolder.add(presets, 'Save');

    Preset.Get('presets')
    .then( results => results.forEach(insertPreset));
}

export default class DHP
{
    static get gui()
    {
        if(!document)
        {
            throw new Error('Document needs to have loaded before using DHP!');
        }
        if(!_gui)
        {
            _gui = new dat.GUI({hideable: false});
        }
        return _gui;
    }

    static get show() { return _shown; }
    static set show(value)
    {
        if(value)
        {
            if(!_gui)
            {
                for(const key in _controller)
                {
                    add(key);
                }

                loadPresets();
                console.log('DHP initiated');
            }
            DHP.gui.domElement.style.display = '';
        }
        else if(_gui)
        {
            _gui.domElement.style.display = 'none';
        }

        _shown = value;
    }

    /**
     * @param {string} name 
     * @param {any} value 
     * @param {ParameterCallback} callback 
     */
    static Add(name, value, callback)
    {
        const local = {};
        local[name] = _controller[name] = value;
        Object.defineProperty(_controller, name, {
            enumerable: true,
            get: () => local[name],
            set: value => {
                if(value !== local[name])
                {
                    callback(local[name] = value);
                }
            }
        });

        if(_gui)
        {
            add(key);
        }
    }

    static Get(name)
    {
        return _controller[name];
    }

    /**
     * Registers DHP to show when 'Shift + combo keys' are pressed
     * @param {Array<string>} [args] defaults: shift + d,h
     */
    static RegisterKeyCombo(...args)
    {
        const combo = !args || args.length == 0 ? ['d', 'h'] : args;

        window.addEventListener('keydown', e => {
            if (e.shiftKey)
            {
                const numCombo = combo.length;

                _comboIndex = e.key.toLowerCase() === combo[_comboIndex] ? _comboIndex + 1 : 0;
                    
                if(_comboIndex === numCombo)
                {
                    DHP.show = !DHP.show;
                    _comboIndex = 0;
                }
            }
            else
            {
                _comboIndex = 0;
            }
        });
    }
}