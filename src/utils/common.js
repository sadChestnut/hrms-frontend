import moment from 'moment'

function formateTime (time) {
  return moment(time).format('YYYY-MM-DD')
}

function formatePostLists (postlists) {
  return postlists.map((item, index) => {
    return item.post + '/' + item.number + '位' + '/' + item.skill
  }).join('; ')
}

function formateEmpPlan (val) {
  return val.map(item => {
    return ' ' + item.empnum + ' ' + item.empname + ' ' + item.identity + ' ' + moment(item.starttime).format('YYYY/MM/DD') + '-' + moment(item.endtime).format('YYYY/MM/DD')
  }).join(';')
}

function openStaffResume (empnum) {
  let routeData = this.$router.resolve({ path: '/staffResume/resumedetail', query: { empnum: empnum } })
  window.open(routeData.href, '_blank')
}

function download (data, filename) {
  if (!data) return
  let url = window.URL.createObjectURL(new Blob([data], { type: 'application/octet-stream' }))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function deepClone (arr) {
  let newarr = []
  arr.forEach(item => {
    if (item.items) {
      let brr = []
      item.items.forEach(i => {
        brr.push(JSON.parse(JSON.stringify(i)))
      })
      newarr.push({ label: item.label, icon: item.icon, items: brr })
    } else {
      newarr.push(JSON.parse(JSON.stringify(item)))
    }
  })
  return newarr
}

// function deepClone (obj) {
//   var objClone = Array.isArray(obj) ? [] : {}
//   let key
//   if (obj && typeof obj === 'object') {
//     for (key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         if (obj[key] && typeof obj[key] === 'object') {
//           objClone[key] = deepClone(obj[key])
//         } else {
//           objClone[key] = obj[key]
//         }
//       }
//     }
//   }
//   return objClone
// }

export {
  formateTime,
  formatePostLists,
  formateEmpPlan,
  openStaffResume,
  download,
  deepClone
}
