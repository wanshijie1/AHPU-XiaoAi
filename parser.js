/**
 * @Author: 雨中人
 * @：人工智能222万世杰
 * @Date: 2024-04-11 
 * @LastEditTime: 2024-07-7 21:57:50
 * @LastEditors: xiaoxiao
 * @Description: 苦心编写多日，参考了大佬模板
 * @QQ：2190638246
 * https://github.com/wanshijie1
 */
function resolveCourseConflicts(parsedCourses) {
    let splitTag = "&";
    let allResultSet = new Set();
    parsedCourses.forEach(course => {
        course.weeks.forEach(week => {
            course.sections.forEach(section => {
                let parsedCourse = {
                    sections: [],
                    weeks: [],
                    name: course.name,
                    teacher: course.teacher,
                    position: course.position,
                    day: course.day
                };
                parsedCourse.weeks.push(week);
                parsedCourse.sections.push(section);
                allResultSet.add(JSON.stringify(parsedCourse));
            });
        });
    });

    let allResult = JSON.parse("[" + Array.from(allResultSet).toString() + "]").sort(function(a, b) {
        return (a.day - b.day) || (a.sections[0] - b.sections[0]);
    });

    let contractedResult = [];
    while (allResult.length !== 0) {
        let firstCourse = allResult.shift();
        if (firstCourse === undefined) continue;
        let weekTag = firstCourse.day;

        for (let i = 0; allResult[i] !== undefined && weekTag === allResult[i].day; i++) {
            if (firstCourse.weeks[0] === allResult[i].weeks[0]) {
                if (firstCourse.sections[0] === allResult[i].sections[0]) {
                    let index = firstCourse.name.split(splitTag).indexOf(allResult[i].name);
                    if (index === -1) {
                        firstCourse.name += splitTag + allResult[i].name;
                        firstCourse.teacher += splitTag + allResult[i].teacher;
                        firstCourse.position += splitTag + allResult[i].position;
                        firstCourse.position = firstCourse.position.replace(/undefined/g, '');
                        allResult.splice(i, 1);
                        i--;
                    } else {
                        let teachers = firstCourse.teacher.split(splitTag);
                        let positions = firstCourse.position.split(splitTag);
                        teachers[index] = teachers[index] === allResult[i].teacher ? teachers[index] : teachers[index] + "," + allResult[i].teacher;
                        positions[index] = positions[index] === allResult[i].position ? positions[index] : positions[index] + "," + allResult[i].position;
                        firstCourse.teacher = teachers.join(splitTag);
                        firstCourse.position = positions.join(splitTag);
                        firstCourse.position = firstCourse.position.replace(/undefined/g, '');
                        allResult.splice(i, 1);
                        i--;
                    }
                }
            }
        }
        contractedResult.push(firstCourse);
    }

    let finallyResult = [];
    while (contractedResult.length !== 0) {
        let firstCourse = contractedResult.shift();
        if (firstCourse === undefined) continue;
        let weekTag = firstCourse.day;

        for (let i = 0; contractedResult[i] !== undefined && weekTag === contractedResult[i].day; i++) {
            if (firstCourse.weeks[0] === contractedResult[i].weeks[0] && firstCourse.name === contractedResult[i].name && firstCourse.position === contractedResult[i].position && firstCourse.teacher === contractedResult[i].teacher) {
                if (firstCourse.sections[firstCourse.sections.length - 1] + 1 === contractedResult[i].sections[0]) {
                    firstCourse.sections.push(contractedResult[i].sections[0]);
                    contractedResult.splice(i, 1);
                    i--;
                } else {
                    break;
                }
            }
        }
        finallyResult.push(firstCourse);
    }

    contractedResult = JSON.parse(JSON.stringify(finallyResult));
    finallyResult.length = 0;
    while (contractedResult.length !== 0) {
        let firstCourse = contractedResult.shift();
        if (firstCourse === undefined) continue;
        let weekTag = firstCourse.day;

        for (let i = 0; contractedResult[i] !== undefined && weekTag === contractedResult[i].day; i++) {
            if (firstCourse.sections.sort((a, b) => a - b).toString() === contractedResult[i].sections.sort((a, b) => a - b).toString() && firstCourse.name === contractedResult[i].name && firstCourse.position === contractedResult[i].position && firstCourse.teacher === contractedResult[i].teacher) {
                firstCourse.weeks.push(contractedResult[i].weeks[0]);
                contractedResult.splice(i, 1);
                i--;
            }
        }
        finallyResult.push(firstCourse);
    }

    console.log(finallyResult);
    return finallyResult;
}

function scheduleHtmlParser(html) {
    let result = [];
    let parsedJson = JSON.parse(html);

    parsedJson.forEach(item => {
        let parsedCourse = {
            weeks: [],
            sections: [],
            name: item.courseName.split("(")[0],
            position: item.roomName.replace(/\(.*?校区\)/g, ""),
            day: item.day,
            teacher: item.teacherName
        };
        parsedCourse.weeks = item.weeks;
        parsedCourse.sections = item.sections;
        result.push(parsedCourse);
    });

    return resolveCourseConflicts(result);
}
