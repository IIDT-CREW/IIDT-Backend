const isNull = (param) => {
    let result = false;
    if( param === undefined || param === null || param === '' ) {
        result = false;
    } else {
        result = true;
    }
}

const makeJsonKeyUpper = (param) => {
    if (Array.isArray(param)) {
      const tempArray = []
      param.map(row => {
        const keys = Object.keys(row.toJSON())
        const tempJson = {}
        keys.map(key => {
          const tempKey = key.toUpperCase()
          tempJson[tempKey] = row[key]
        })
        tempArray.push(tempJson)
      })
      return tempArray;
    } else {
      const keys = Object.keys(row.toJSON())
      const tempJson = {}
      keys.map(key => {
        const tempKey = key.toUpperCase()
        tempJson[tempKey] = row[key]
      })
      return tempJson
    }
  }
  
const makeJsonKeyLower = (param) => {
    if (Array.isArray(param)) {
      const tempArray = []
      param.map(row => {
        const keys = Object.keys(row.toJSON())
        const tempJson = {}
        keys.map(key => {
          const tempKey = key.toLowerCase()
          tempJson[tempKey] = row[key]
        })
        tempArray.push(tempJson)
      })
      return tempArray;
    } else {
      const keys = Object.keys(row.toJSON())
      const tempJson = {}
      keys.map(key => {
        const tempKey = key.toLowerCase()
        tempJson[tempKey] = row[key]
      })
      return tempJson
    }
  }

module.exports = {
    isNull: isNull,
    makeJsonKeyUpper: makeJsonKeyUpper,
    makeJsonKeyLower: makeJsonKeyLower
}