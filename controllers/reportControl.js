import { getDailyReport, getMonthlyReport, getYearlyReport, getLocationReport, getDurationReport, getCoursesReport, insertQuestionNoDate, insertQuestionYesDate } from '../models/database.js';



export const daily_report = (async (req,res)=> {
    const userdate = req.query.date
    const reportDaily = await getDailyReport(userdate)
    res.render("Report-Preview-Daily.ejs",{reportDaily})
  })

export const monthly_report = (async (req,res)=> {
  const userdate = req.query.date
  const  cleanDate = userdate
  //let cleanDate = rawdate.slice(0,7)
  let cleanYear = cleanDate.substring(0,4)
  let cleanMonth = cleanDate.substring(5,7)
  const date = new Date(cleanYear,cleanMonth)
  const dateArray = []
  for(let i = 0; i < 6; i++)
    {   
      date.setMonth(date.getMonth()-1)
      let dateISO =(date.toISOString())
      let saveDate = dateISO.slice(0,7)
      dateArray.push(saveDate)
    }
    const reportMonthly = await getMonthlyReport(dateArray)
    console.log(Object.keys(reportMonthly[0]))
    let months = Object.keys(reportMonthly[0])
    console.log(Object.values(reportMonthly[0]))
    let monthValue = Object.values(reportMonthly[0])
    const monthlyNumbers = {months, monthValue}; 
    res.render("Report-Preview-Monthly.ejs",{monthlyNumbers})
  })

export const yearly_report = (async (req,res)=> {
    const userdate = req.query.date
    const targetYear = userdate
    let year = targetYear.slice(0,4)
    const reportYearly = await getYearlyReport(year)
    res.render("Report-Preview-Yearly.ejs",{reportYearly})
  })

export const location_report = (async (req,res)=> {
  const userdate = req.query.date
  const targetYear = userdate
  let year = targetYear.slice(0,4)
  const reportLocation = await getLocationReport(year)
    res.render("Report-Preview-Location.ejs", {reportLocation})
  })

export const duration_report = (async (req,res)=> {
  const userdate = req.query.date
  const targetYear = userdate
  let year = targetYear.slice(0,4)
  const reportDuration = await(getDurationReport(year))
    res.render("Report-Preview-Duration.ejs", {reportDuration})
  })

export const courses_report = (async (req,res)=> {
  const userdate = req.query.date
  const targetYear = userdate 
  let year = targetYear.slice(0,4)
  const reportCourses = await(getCoursesReport(year))
  const courses = []
  const questions = []
  Object.entries(reportCourses).forEach(([key]) =>{courses.push(reportCourses[key].courseCode), questions.push(reportCourses[key].numberOfQuestions)})
  console.log(courses)
  console.log(questions)
  res.render("Report-Preview-Courses.ejs",{courses,questions})
  })

  export const test = (async (req,res)=> {
    const test1 = await insertQuestionNoDate(1,1,1,1,null,null);
    const test2 = await insertQuestionYesDate(1,1,1,1,null,null, "2024-03-26 16:55:09");
    res.send(test2)
  })