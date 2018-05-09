'use strict';

class Controller {
    static bind(view, model) {
        function dom(id) {
            return document.getElementById(id);
        }

        Controller.viewMap[view.id] = view;
        Controller.modelMap[model.id] = model;
        Controller.mvMap[view.id] = model.id;
        Controller.mvMap[model.id] = view.id;

        let viewFunc = view.func;
        let modelFunc = model.func;

        view.setV('update', modelFunc);
        model.setV('update', viewFunc);
    }

    static getView(id) {
        let view = Controller.viewMap[id];

        if (!view) {
            let viewId = Controller.mvMap[id];
            view = Controller.viewMap[viewId];
        }
        return view;
    }

    static getModel(id) {
        let model = Controller.modelMap[id];

        if (!model) {
            let modelId = Controller.mvMap[id];
            model = Controller.viewMap[modelId];
        }
        return model;
    }
}

Controller.viewMap = {};
Controller.modelMap = {};
Controller.mvMap = {};
