import express from 'express';

import { daily_report, monthly_report, yearly_report, location_report, duration_report, courses_report, test, head_count, insert_question } from '../controllers/reportControl.js'
export const routerReport = express.Router()

routerReport.get('/getDaily', daily_report)
routerReport.get('/getMonthly', monthly_report)
routerReport.get('/getYearly', yearly_report)
routerReport.get('/getLocation', location_report)
routerReport.get('/getDuration', duration_report)
routerReport.get('/getCourses', courses_report)
routerReport.get('/test', test)
routerReport.post('/insertHeadcount', head_count)
routerReport.post('/insert-question', insert_question);