import Firebase from "./Firebase";

export default class Preset
{
    /** @param {string} [name] */
    constructor(name)
    {
        this.name = name;
        /** @type {any} */
        this.data;
    }

    /** @param {string} path */
    Save(path)
    {
        Firebase.Add(path, this.data);
    }

    static Flatten(obj)
    {
        const data = {};
        for(const key in obj)
        {
            data[key] = obj[key];
        }
        return data;
    }

    /** @returns {Promise<Preset|Array<Preset>>} */
    static Get(path)
    {
        return new Promise( (resolve, reject) => {
            Firebase.Get(path)
            .then(result => {
                if(result instanceof Array)
                {
                    const presets = [];
                    for(let i = 0; i < result.length; i++)
                    {
                        const preset = new Preset(result[i].id);
                        preset.data = result[i].data;
                        presets.push(preset);
                    }
                    resolve(presets);
                }
                else if(result)
                {
                    const preset = new Preset(result.id);
                    preset.data = result.data;
                    resolve(preset);
                }
                else
                {
                    reject('Invalid result');
                }
            })
            .catch(reject);
        });
    }
}