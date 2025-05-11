import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'


export const useMainStore = defineStore('cacheMainData', () => {
    let fileContTemp = ref({
        type: '', filePath: '', content: {
            name: "qiu",//字符串
            age: 18,//数组
            isMan: false,//布尔值
            date: new Date(),
            fn: () => { },
            arr: [1, 2, 5],
            reg: /ab+c/i
        }
    })
    const globalProperties = ref({});
    function onSave(cb) {
        window.microApp.dispatch({
            type: "save",
            ...fileContTemp.value
        }, () => {
            cb()
            globalProperties.value.$message.success("保存成功");
        })
    }
    return {
        fileContTemp,
        globalProperties,
        onSave
    }
})