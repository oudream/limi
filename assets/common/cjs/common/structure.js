/**
 * Created by liuchaoyu on 2017-03-09.
 */
'use strict';

class NeManager {
    constructor(groups) {
        this.group_count = 0;
        this.groups = {};

        if (groups) {
            for (let t in groups) {
                this.addGroup(t);

                let nes = groups[t];
                let nesLength = nes.length;

                for (let i = 0; i < nesLength; i++) {
          // let _ne = nes[i];
                    let _ne = new NetworkElement(nes[i]);
                    this.addNe(t, _ne);
                }
            }
        }
    }

    getGroup(key) {
        if (!key) {
            console.log('key is null!');
            return -1;
        }

        return this.groups[key];
    }

    addGroup(key) {
        if (!key) {
            console.log('key is null!');
            return -1;
        }

        if (this.groups[key] != undefined) {
            console.log('key is exist!');
            return -2;
        }

        this.groups[key] = [];
        this.group_count++;
        return 1;
    }

    removeGroup(key) {
        if (!key) {
            console.log('key is null!');
            return -1;
        }

        this.groups[key] = null;
        delete this.groups[key];
        this.group_count--;
    }

    getNoneNullGroupKeys() {
        let keys = [];
        let groups = this.groups;
        for (let t in groups) {
            if (groups[t].length > 0) {
                keys.push(t);
            }
        }

        return keys;
    }

    addNe(groupKey, ne) {
        if (!groupKey) {
            console.log('groupKey is null!');
            return -1;
        }

        if (!ne) {
            console.log('ne is null!');
            return -1;
        }

    // let _ne = {};
    // for (let attr in ne) {
    //     _ne[attr] = ne[attr];
    // }

        if (this.groups[groupKey] == undefined) {
            this.groups[groupKey] = [];
        }

        let group = this.groups[groupKey];
        group.push(ne);
        group = null;

        return 1;
    }

    removeNe(groupKey, ne) {
        if (!groupKey) {
            console.log('groupKey is null!');
            return -1;
        }

        if (!ne) {
            console.log('ne is null!');
            return -1;
        }

        let group = this.groups[groupKey];
        let groupLength = group.length;

        for (let i = 0; i < groupLength; i++) {
            let _ne = group[i];
            if (_ne.id == ne.id) {
                group[i] = null;
                _ne = null;
                group.splice(i, 1);
                break;
            }
        }

        return 1;
    }

    editNe(neId, attrName, attrValue) {
        if (!neId) {
            console.log('neId is null!');
            return -1;
        }

        let _neId = null;
        if (typeof neId === 'string') {
            _neId = parseInt(neId, 10);
        } else if (typeof neId === 'number') {
            _neId = neId;
        }

        let groupId = utils.number.getHighBit(_neId);

        if (!groupId) {
            return -1;
        }

        let group = this.groups[groupId];
        let groupLength = group.length;

        for (let i = 0; i < groupLength; i++) {
            let _ne = group[i];
            if (_ne.id == _neId) {
                _ne.setV(attrName, attrValue);
                return 1;
            }
        }

        return -2;
    }

    getNe(neId) {
        if (!neId) {
            console.log('neId is null!');
            return null;
        }

        let _neId = null;
        if (typeof neId === 'string') {
            _neId = parseInt(neId, 10);
        } else if (typeof neId === 'number') {
            _neId = neId;
        }

        let groupId = null;
        if (_neId == 1) {
            groupId = '0x31';
        } else {
            groupId = '0x' + _neId.toString(16);
        }

        if (!groupId) {
            return null;
        }

        let group = this.groups[groupId];
        let groupLength = group.length;

        for (let i = 0; i < groupLength; i++) {
            let _ne = group[i];
            if (_ne.id == _neId) {
                return _ne;
            }
        }

        return null;
    }
    getAlarmNe(neId, neType) {
        if (!neId) {
            console.log('neId is null!');
            return null;
        }

        let _neId = null;
        if (typeof neId === 'string') {
            _neId = parseInt(neId, 10);
        } else if (typeof neId === 'number') {
            _neId = neId;
        }

        let _neType = null;
        if (typeof neType === 'string') {
            _neType = parseInt(neType, 10);
        } else if (typeof neType === 'number') {
            _neType = neType;
        }

        let groupId = null;
        if (_neType > 0 && _neType < 16) {
            groupId = '0x0' + _neType.toString(16);
        } else {
            groupId = '0x' + _neType.toString(16);
        }

        if (!groupId) {
            return null;
        }

        let group = this.groups[groupId];
        let groupLength = group.length;

        for (let i = 0; i < groupLength; i++) {
            let _ne = group[i];
            if (_ne.id === _neId) {
                return _ne;
            }
        }

        return null;
    }

    getNeByName(neName) {
        if (!neName) {
            console.log('neId is null!');
            return null;
        }

        let groups = this.groups;
        for (let t in groups) {
            let _nes = groups[t];
            let _nesLength = _nes.length;

            for (let i = 0; i < _nesLength; i++) {
                let _ne = _nes[i];

                if (_ne.name == neName) {
                    return _ne;
                }
            }
        }

        return null;
    }

    getNesInGroup(groupId) {
        if (!groupId) {
            return null;
        }

        let nes = this.groups[groupId];

        return nes;
    }

    getAllNes() {
        let allNes = [];
        let groups = this.groups;
        for (let t in groups) {
            let nes = this.getGroup(t);

            let nesLength = nes.length;

            for (let i = 0; i < nesLength; i++) {
                let _ne = nes[i];
                allNes.push(_ne);
            }
        }

        return allNes;
    }

  /**
   * 通过过滤条件获取网元
   * @param filter : object 过滤条件对象 ｛key:xxx,value:xxx,isEqual:true or false}
   */
    getNesByFilter(filter) {
        let neArray = [];
        let groups = this.groups;
        for (let t in groups) {
            let nes = this.getGroup(t);
            let nesLength = nes.length;
            for (let i = 0; i < nesLength; i++) {
                let _ne = nes[i];
                if (filter.isEqual) {
                    if (typeof _ne[filter.key] == 'object' && _ne[filter.key].length) {
                        if (_ne[filter.key].length == filter.value) {
                            neArray.push(_ne);
                        }
                    } else {
                        if (_ne[filter.key] == filter.value) {
                            neArray.push(_ne);
                        }
                    }
                } else {
                    if (typeof _ne[filter.key] == 'object' && _ne[filter.key].length) {
                        if (_ne[filter.key].length != filter.value) {
                            neArray.push(_ne);
                        }
                    } else {
                        if (_ne[filter.key] != filter.value) {
                            neArray.push(_ne);
                        }
                    }
                }
            }
        }

        return neArray;
    }

}

class NetworkElement {
    constructor(neParams) {
        for (let t in neParams) {
            this[t] = neParams[t];
        }

        if (neParams['neNo']) {
            this.id = neParams['neNo'];
            this.idHex = (neParams['neNo']).toString(16);
        } else {
            let _id = utils.dataProcess.getId(this.type, this.index);

            this.id = neParams.id || _id.id;
            this.idHex = _id.idHex;
        }

        if (!this.alarmTypes) {
            this.alarmTypes = [];
        }
    //
    // if (!this.alarmLevel) {
    //     this.alarmLevel = null;
    // }
    //
    // if (!this.alarmConfirm) {
    //     this.alarmConfirm = null;
    // }
    }

    setV(attrName, value) {
        if (attrName) {
            this[attrName] = value;
        }
    }

    getV(attrName) {
        if (attrName) {
            return this[attrName];
        } else {
            console.log('attrName is null');
            return -1;
        }
    }

  /**
   * 获取有效网元序号的函数
   * @param nes: 网元数组
   * @returns {number}: 序号
   */
    static getVaildNeIndex(nes) {
        let neIndexs = [];
        let nesLength = nes.length;
        for (let i = 0; i < nesLength; i++) {
            let _ne = nes[i];
            neIndexs.push(_ne.index);
        }

        if (nesLength > 0) {
            return utils.number.getVaildIndex(neIndexs);
        } else {
            return 1;
        }
    }
}

/**
 * 告警项管理器
 */
class AlarmItemManager {

    constructor(alarms) {
        this.alarmItems = [];

        for (let i = 0; i < alarms.length; i++) {
            this.addAlarm(alarms[i]);
        }
    }

    addAlarm(obj) {
        if (!obj) {
            return -1;
        }

        if (typeof obj !== 'object') {
            return -2;
        }

        if (!obj.AlarmType) {
            return -3;
        }

    // if (this.findAlarm(obj.AlarmType) != -1) {
    // if (this.findAlarmByFilter({key: 'rowId', value: obj.rowId, isEqual: true}) !== -1) {
        if (this.findAlarmByFilter({key: 'AlarmType', value: obj.AlarmType, isEqual: true}) !== -1) {
            return -4;
        } else {
            let alarmItem = new AlarmItem(obj);
            this.alarmItems.push(alarmItem);
            return 1;
        }
    }

    addAlarmSpec(obj, key) {
        if (!obj) {
            return -1;
        }

        if (typeof obj !== 'object') {
            return -2;
        }

        if (!obj.AlarmType) {
            return -3;
        }

        let _obj = {};
        _obj[key] = obj[key];
        if (this.findAlarmByFilter(_obj) != -1) {
            return -4;
        } else {
            let alarmItem = new AlarmItem(obj);
            this.alarmItems.push(alarmItem);

            return 1;
        }
    }

    removeAlarm(id) {
        let index = this.findAlarm(id);
        if (index != -1) {
            this.alarmItems[index] = null;
            this.alarmItems.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    removeAlarmByFilter(filter) {
        if (!filter) {
            return -2;
        }
        let index = this.findAlarmByFilter(filter);
        if (typeof index === 'number') {
            this.alarmItems[index] = null;
            this.alarmItems.splice(index, 1);
            return true;
        } else if (index.length && index.length > 0) {
            for (let i = 0; i < this.alarmItems.length; i++) {
                if (index.indexOf(i) !== -1) {
                    this.alarmItems[i] = null;
                }
            }

            for (let i = 0; i < this.alarmItems.length; i++) {
                if (this.alarmItems[i] === null) {
                    this.alarmItems.splice(i, 1);
                    i--;
                }
            }
            return true;
        } else {
            return -1;
        }
    }

    getAlarm(id) {
        let index = this.findAlarm(id);
        if (index !== -1) {
            return this.alarmItems[index];
        } else {
            return null;
        }
    }

    getAlarmByFilter(filter) {
        if (!filter) {
            return -2;
        }

        let index = this.findAlarmByFilter(filter);
        if (typeof index === 'number' && index !== -1) {
            return this.alarmItems[index];
        } else if (index.length && index.length > 0) {
            return this.alarmItems[index[0]];
        } else {
            return -1;
        }
    }

  /**
   * 通过过滤条件获取告警
   * @param filter : object 过滤条件对象 ｛key:xxx,value:xxx,isEqual:true or false}
   */
    getAlarmsByFilter(filter) {
        let alarmArray = [];
        let group = this.alarmItems;
        let array = this.findAlarmByFilter(filter);

        if (typeof array === 'number' && array !== -1) {
            alarmArray.push(group[array]);
        } else if (array.length && array.length > 0) {
            for (let i = 0; i < array.length; i++) {
                let index = array[i];
                alarmArray.push(group[index]);
            }
        }
        return alarmArray;
    }

    getAllAlarms() {
        return this.alarmItems;
    }

    editAlarm(id, attrName, attrValue) {
        let index = this.findAlarm(id);
        if (index !== -1) {
            this.alarmItems[index][attrName] = attrValue;

            return true;
        } else {
            return false;
        }
    }

    editAlarmByFilter(filter, attrName, attrValue) {
        let index = this.findAlarmByFilter(filter);

        if (typeof index === 'number') {
            this.alarmItems[index][attrName] = attrValue;
            return 1;
        } else if (index.length && index.length > 0) {
            this.alarmItems[index[0]][attrName] = attrValue;
            return 2;
        } else {
            return -1;
        }
    }

    findAlarm(id) {
        if (!id) {
            return -1;
        }

        let _id = null;
        if (typeof id === 'string') {
            _id = parseInt(id, 10);
        } else {
            _id = id;
        }

        let result = -1;

        for (let i = 0; i < this.alarmItems.length; i++) {
            if (this.alarmItems[i].AlarmType) {
                if (this.alarmItems[i].AlarmType === _id) {
                    result = i;
                }
            } else if (this.alarmItems[i].alarmType) {
                if (this.alarmItems[i].alarmType === _id) {
                    result = i;
                }
            }
        }
        return result;
    }

    findAlarmByFilter(filter) {
        let array = [];
        let group = this.alarmItems;
        let length = group.length;
        for (let i = 0; i < length; i++) {
            let _alarm = group[i];
            if (filter.length && filter.length > 0) {
                let _result = 0;
                for (let j = 0; j < filter.length; j++) {
                    if (filter[j].isEqual) {
                        if (_alarm[filter[j].key] === filter[j].value) {
                            _result++;
                        }
                    } else {
                        if (_alarm[filter[j].key] !== filter[j].value) {
                            _result[j]++;
                        }
                    }
                }

                if (_result === filter.length) {
                    array.push(i);
                }
            } else {
                if (filter.isEqual) {
                    if (_alarm[filter.key] === filter.value) {
                        array.push(i);
                    }
                } else {
                    if (_alarm[filter.key] !== filter.value) {
                        array.push(i);
                    }
                }
            }
        }

        if (array.length > 1) {
            return array;
        } else if (array.length === 1) {
            return array[0];
        } else {
            return -1;
        }
    }
}

/**
 * 告警项类
 */
class AlarmItem {
    constructor(alarmObj) {
        for (let t in alarmObj) {
            this[t] = alarmObj[t];
        }

        this.extend_type = (!this.extend_type) ? null : this.extend_type;
        this.extend_opt = (!this.extend_opt) ? null : this.extend_opt;
        this.extend_color = (!this.extend_color) ? '' : this.extend_color;
        this.extend_sound = (!this.extend_sound) ? '' : this.extend_sound;
        this.extend_soundCount = (!this.extend_soundCount) ? 0 : this.extend_soundCount;
    }
}
