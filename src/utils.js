// 分值对照
const scoreList = {
  CF: {
    tag: '善始善终者',
    line: [18, 67, 93],
    map: [0, 11, 18, 31, 41, 51, 56, 67, 72, 78, 83, 85, 89, 93]
  },
  CO: {
    tag: '协调者',
    line: [29, 64, 95],
    map: [0, 3, 6, 11, 19, 29, 48, 55, 64, 72, 80, 82, 86, 90, 91, 93, 95]
  },
  IM: {
    tag: '实干者',
    line: [29, 68, 93],
    map: [0, 1, 2, 4, 8, 14, 19, 29, 36, 49, 61, 68, 77, 83, 86, 91, 93]
  },
  ME: {
    tag: '监督者',
    line: [23, 61, 94],
    map: [0, 1, 4, 12, 23, 31, 41, 52, 61, 72, 82, 89, 92, 94]
  },
  PL: {
    tag: '智多星',
    line: [25, 64, 95],
    map: [0, 8, 16, 25, 38, 45, 53, 64, 75, 82, 84, 86, 90, 92, 93, 95]
  },
  RI: {
    tag: '外联者',
    line: [23, 66, 95],
    map: [0, 3, 7, 16, 23, 32, 38, 49, 64, 72, 71, 77, 83, 86, 90, 95]
  },
  SH: {
    tag: '鞭策者',
    line: [23, 64, 95],
    map: [0, 1, 4, 6, 12, 18, 23, 30, 36, 45, 50, 55, 64, 71, 75, 79, 83, 86, 87, 89, 92, 93, 95]
  },
  SP: {
    tag: '专家',
    line: [24, 69, 95],
    map: [0, 8, 11, 24, 30, 46, 53, 64, 69, 74, 77, 85, 89, 92, 95]
  },
  TW: {
    tag: '凝聚者',
    line: [27, 67, 95],
    map: [0, 1, 6, 12, 19, 27, 37, 49, 60, 67, 74, 79, 83, 89, 94, 95]
  }
}

export default {

  /**
   * 原始分值转换
   * @param {string} type      分数类别
   * @param {number} oldScore  原始分值
   */
  convertScore (type, oldScore) {
    // 非数值转换
    if (typeof oldScore !== 'number') {
      oldScore = parseInt(oldScore)
    }
    // 获取原始分值上限
    const len = scoreList[type].map.length - 1
    // 当原始分值大于上限，返回最高分
    if (oldScore > len) {
      return scoreList[type].map[len]
    }
    return scoreList[type].map[oldScore]
  },

  /**
   * 分值颜色
   * @param {string} type  分数类别
   * @param {number} score 原始分值
   */
  tagColor (type, score) {
    // 非数值转换
    if (typeof score !== 'number') {
      score = parseInt(score)
    }
    // 转换分数
    score = this.convertScore(type, score)
    // 获取分数线
    const line = scoreList[type].line
    // 返回对应颜色
    if (score >= line[2]) { // 优秀
      return '#409EFF'
    }
    if (score >= line[1]) { // 自然
      return '#67C23A'
    }
    if (score >= line[0]) { // 次要
      return '#F56C6C'
    }
    // 避免
    return '#909399'
  },

  /**
   * 生成标签头衔
   * @param {array} arrObj 分值集合
   */
  createTag (arrObj) {
    let tags = []
    arrObj.forEach((val) => {
      if (val.code !== '') {
        // 获取及格线
        let line = scoreList[val.code].line[1]
        // 及格则追加对应头衔
        if (this.convertScore(val.code, val.score) > line) {
          tags.push(scoreList[val.code].tag)
        }
      }
    })
    if (tags.length > 0) {
      return tags
    }
  },

  /**
   * 获取缓存数
   * @param {string} fields 缓存字段
   */
  getCache (fields) {
    const cache = localStorage.getItem(fields)
    if (!cache) {
      return false
    }
    return JSON.parse(cache)
  },

  /**
   * 设置缓存
   * @param {string} fields 缓存字段
   * @param {object} data   缓存对象
   */
  setCache (fields, data) {
    if (fields === 'admin') {
      if ('time' in data && data.time) {
        data.time = new Date(data.time).getTime()
      }
      // else {
      //   data.time = new Date().getTime()
      // }
      // if (!data.token) {
      //   data.token = 'token test'
      // }
    }
    if (fields === 'user') {
      data.staff_no += ''
    }
    localStorage.setItem(fields, JSON.stringify(data))
  },

  /**
   * 获取数据类型
   * @param {all} data 检测对象
   */
  getType (data) {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
  },

  /**
   * HEX 转换 RGB
   * @param {string} hex 十六进制颜色
   */
  hexToRgb (hex) {
    if (!hex) {
      return 'rgb(255, 255, 255)'
    }
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    hex = hex.toLowerCase()
    // 如果是16进制颜色
    if (hex && reg.test(hex)) {
      if (hex.length === 4) {
        let hexNew = '#'
        for (let i = 1; i < 4; i++) {
          hexNew += hex.slice(i, i + 1).concat(hex.slice(i, i + 1))
        }
        hex = hexNew
      }
      // 处理六位的颜色值
      var hexChange = []
      for (var i = 1; i < 7; i += 2) {
        hexChange.push(parseInt('0x' + hex.slice(i, i + 2)))
      }
      return 'rgb(' + hexChange.join(',') + ')'
    }
    return hex
  },

  /**
   * RGB 转换 HSL
   * @param {number} rgb
   */
  rgbToHsl (rgb) {
    rgb = rgb.slice(4).split(',').map(val => parseInt(val))
    let rgbPx = [...rgb].sort((a, b) => a - b)
    const max = rgbPx[2]
    const min = rgbPx[0]
    let h
    let s
    let l = (max + min) / 2
    if (max === min) {
      h = s = 0 // achromatic
    } else {
      let d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case rgb[0]: h = (rgb[1] - rgb[2]) / d + (rgb[1] < rgb[2] ? 6 : 0); break
        case rgb[1]: h = (rgb[2] - rgb[0]) / d + 2; break
        case rgb[2]: h = (rgb[0] - rgb[1]) / d + 4; break
      }
      h /= 6
    }
    return [h, s, l]
  },
  /**
   * 数值转中文大写
   * @param {number} n 阿拉伯数字
   */
  digitDX (n) {
    const enums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    const scale = ['', '十', '百', '千']
    let strIns = ''
    let chnStr = ''
    let unitPos = 0
    let zero = true
    while (n > 0) {
      let v = n % 10
      if (v === 0) {
        if (!zero) {
          zero = true
          chnStr = enums[v] + chnStr
        }
      } else {
        zero = false
        strIns = enums[v]
        strIns += scale[unitPos]
        chnStr = strIns + chnStr
      }
      unitPos++
      n = Math.floor(n / 10)
    }
    return chnStr
  },
  /**
   * 分数数组求和
   * @param {array} arr 阿拉伯数字
   */
  sum (arr) {
    let sum = 0
    for (let val of arr) {
      sum += val
    }
    return sum
  }
}
