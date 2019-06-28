import * as dat from 'dat.gui';

/** ParameterCallback
 * @callback ParameterCallback
 * @param {any} value
 */

/** @type {dat.GUI} */
let _gui;

const _controller = {};

let _shown = false;
let _comboIndex = 0;

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
                    DHP.gui.add(_controller, key);
                }
                console.log('DHP initiated');
            }
            _gui.domElement.style.display = '';
        }
        else if(_gui)
        {
            _gui.domElement.style.display = 'none';
        }

        _shown = value;
    }

    /**
     * Registers DHP to show when 'Shift + combo keys' are pressed
     * @param {Array<string>} [args]
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
            DHP.gui.add(_controller, name);
        }
    }

    static Get(name)
    {
        return _controller[name];
    }
}