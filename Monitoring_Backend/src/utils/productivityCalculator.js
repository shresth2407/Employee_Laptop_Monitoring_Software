export const calculateProductivity = (activities)=>{

 let activeSeconds = 0
 let idleSeconds = 0

 activities.forEach(a=>{

  if(a.isIdle){
   idleSeconds += 60
  }else{
   activeSeconds += 60
  }

 })

 const total = activeSeconds + idleSeconds

 const productivity = total === 0
  ? 0
  : Math.round((activeSeconds/total)*100)

 return {

  activeTime:activeSeconds,
  idleTime:idleSeconds,
  productivity

 }

}