/**
 * @Author: 雨中人
 * @：人工智能222万世杰
 * @Date: 2024-04-11 
 * @LastEditTime: 2024-07-8 02:54   (又熬夜了)
 * @LastEditors: xiaoxiao
 * @Description: 无语学校，奇奇怪怪的时间表
 * @QQ：2190638246
 * @可不可以， 给我个star，亲亲
 * https://github.com/wanshijie1
 */
function getTimes(xJConf, dJConf) {
  // xJConf: 夏季时间配置文件
  // dJConf: 冬季时间配置文件
  // return: 返回一个数组，包含每节课的开始和结束时间
  // 如果没有提供冬季时间配置文件，默认使用夏季时间配置文件
  //没做，太懒了
  dJConf = dJConf === undefined ? xJConf : dJConf;

  // 内部函数，用于根据配置文件生成时间表
  function getTime(conf) {
      let courseSum = conf.courseSum;  // 课程节数，例如: 11 (上午4+下午4+晚上2 )
      let startTime = conf.startTime;  // 上课开始时间，例如: '0800'，新校区早八，老校区早7:40
      let oneCourseTime = conf.oneCourseTime;  // 每节课的时长，例如: 45分钟
      let shortRestingTime = conf.shortRestingTime;  // 小课间休息时间，例如: 5分钟

      let longRestingTimeBegin = conf.longRestingTimeBegin; // 大课间休息的开始节次
      let longRestingTime = conf.longRestingTime;  // 大课间休息时间，例如: 20分钟
      let mediumRestingTimeBegin = conf.mediumRestingTimeBegin; // 中等长度课间休息的开始节次
      let mediumRestingTime = conf.mediumRestingTime;  // 中等长度课间休息时间，例如: 10分钟
      let lunchTime = conf.lunchTime;  // 午休时间(可以回去打游戏喽)
      let dinnerTime = conf.dinnerTime;  // 晚餐时间(防止饿死，可以去南苑搞点吃的)
      let abnormalClassTime = conf.abnormalClassTime;  // 特殊课程时间长度
      let abnormalRestingTime = conf.abnormalRestingTime;  // 特殊休息时间

      let result = [];
      let studyOrRestTag = true;  // 标记当前是上课时间还是休息时间
      let timeSum = parseInt(startTime.slice(0, 2)) * 60 + parseInt(startTime.slice(-2));  // 将开始时间转换为分钟数

      let classTimeMap = new Map();
      let RestingTimeMap = new Map();
      if (abnormalClassTime !== undefined) abnormalClassTime.forEach(time => { classTimeMap.set(time.begin, time.time) });
      if (longRestingTimeBegin !== undefined) longRestingTimeBegin.forEach(time => RestingTimeMap.set(time, longRestingTime));
      if (mediumRestingTimeBegin !== undefined) mediumRestingTimeBegin.forEach(time => RestingTimeMap.set(time, mediumRestingTime));
      if (lunchTime !== undefined) RestingTimeMap.set(lunchTime.begin, lunchTime.time);
      if (dinnerTime !== undefined) RestingTimeMap.set(dinnerTime.begin, dinnerTime.time);
      if (abnormalRestingTime !== undefined) abnormalRestingTime.forEach(time => { RestingTimeMap.set(time.begin, time.time) });

      for (let i = 1, j = 1; i <= courseSum * 2; i++) {
          if (studyOrRestTag) {
              let startTime = ("0" + Math.floor(timeSum / 60)).slice(-2) + ':' + ('0' + timeSum % 60).slice(-2);
              timeSum += classTimeMap.get(j) === undefined ? oneCourseTime : classTimeMap.get(j);
              let endTime = ("0" + Math.floor(timeSum / 60)).slice(-2) + ':' + ('0' + timeSum % 60).slice(-2);
              studyOrRestTag = false;
              result.push({
                  section: j++,  // 课程节次
                  startTime: startTime,  // 课程开始时间
                  endTime: endTime  // 课程结束时间
              });
          } else {
              timeSum += RestingTimeMap.get(j - 1) === undefined ? shortRestingTime : RestingTimeMap.get(j - 1);
              studyOrRestTag = true;
          }
      }
      return result;
  }

  let nowDate = new Date();
  let year = nowDate.getFullYear();
  let wuYi = new Date(year + "/05/01");
  let jiuSanLing = new Date(year + "/09/30");
  let shiYi = new Date(year + "/10/01");
  let nextSiSanLing = new Date((year + 1) + "/04/30");
  let previousShiYi = new Date((year - 1) + "/10/01");
  let siSanLing = new Date(year + "/04/30");
  let xJTimes = getTime(xJConf);
  let dJTimes = getTime(dJConf);
  console.log("夏季时间:\n", xJTimes);
  console.log("冬季时间:\n", dJTimes);

  if (nowDate >= wuYi && nowDate <= jiuSanLing) {
      return xJTimes;
  } else if (nowDate >= shiYi && nowDate <= nextSiSanLing || nowDate >= previousShiYi && nowDate <= siSanLing) {
      return dJTimes;
  }
}

/**
* 时间配置函数，此为入口函数，不要改动函数名
*/
async function scheduleTimer() {
  // 内嵌loadTool工具，传入工具名即可引用公共工具函数
  await loadTool('AIScheduleTools');
  const { AIScheduleAlert } = AIScheduleTools();

  // 只要大声喊出 人工智能222万世杰 yyds 就可以保你代码不出bug
  // await AIScheduleAlert('l人工智能222万世杰 yyds!');
  // 支持异步操作 推荐await写法
  // const someAsyncFunc = () => new Promise(resolve => {
  //     setTimeout(() => resolve(), 100);
  // });  
  // await someAsyncFunc();
  // 返回时间配置JSON，所有项都为可选项，如果不进行时间配置，请返回空对象

  let A = {
      courseSum: 11,
      startTime: '0740',
      oneCourseTime: 45,
      longRestingTime: 20,
      mediumRestingTime: 10, // 添加中等长度课间时间,真是奇葩，不知道为什么🍊单独设置一个10Min的课间时间，而不是直接用shortRestingTime
      shortRestingTime: 5,
      longRestingTimeBegin: [2],
      mediumRestingTimeBegin: [7],
      lunchTime: { begin: 5, time: 2 * 60 + 30 },   //老校区早上7:40山上课，所以这里比新校区多加20分钟
      dinnerTime: { begin: 9, time: 1 * 60 + 10 }
  };

  let B = {
      courseSum: 11,
      startTime: '0800',
      oneCourseTime: 45,
      longRestingTime: 20,
      mediumRestingTime: 10, // 添加中等长度课间时间
      shortRestingTime: 5,
      longRestingTimeBegin: [2],
      mediumRestingTimeBegin: [7],
      lunchTime: { begin: 5, time: 2 * 60 + 10 },
      dinnerTime: { begin: 9, time: 1 * 60 + 10 }
  };

  let id = (await AIScheduleSelect({
      titleText: '时间',
      contentText: '请选择您的校区',
      selectList: ['A:老校区校区', 'B:国际工程师学院校区']
  })).split(':')[0];

  return {
      totalWeek: 18, // 总周数：[1, 30]之间的整数
      startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
      startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
      showWeekend: true, // 是否显示周末
      forenoon: 5, // 上午课程节数：[1, 10]之间的整数
      afternoon: 4, // 下午课程节数：[0, 10]之间的整数
      night: 2, // 晚间课程节数：[0, 10]之间的整数
      sections: getTimes(id === 'A' ? A : B) // 课程时间表，注意：总长度要和上边配置的节数加和对齐
  };
  // PS: 夏令时什么的还是让用户在夏令时的时候重新导入一遍吧，在这个函数里边适配吧！奥里给！————不愿意透露姓名的某人
}
