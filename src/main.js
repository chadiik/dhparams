import DHP from './DHP';

window.addEventListener('load', e => {
    const obj = {
        prop: 0,
        prop2: 0
    };

    DHP.Add('Obj\'s prop', obj.prop, value => {
        obj.prop = Math.max(0, value); // validate value
        console.log('obj.prop', obj.prop);
    });

    DHP.Add('Obj\'s prop2', obj.prop2, value => {
        obj.prop2 = Math.max(0, value); // validate value
        console.log('obj.prop2', obj.prop2);
    });

    DHP.RegisterKeyCombo(); // or DHP.show = true;
    //DHP.show = true;
});