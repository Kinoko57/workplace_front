import request from '@/utils/request'
// 绩效管理批量作废
export function performancebatchCancel(info) {
  return request({
    url: '/ad/performance-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 试卷管理批量作废
export function questionnairebatchCancel(info) {
  return request({
    url: '/ad/survey-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 试卷管理批量作废
export function examIndexbatchCancel(info) {
  return request({
    url: '/ad/dailypaper-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 试题库批量作废
export function questionBankbatchCancel(info) {
  return request({
    url: '/ad/itembank-cancellations.json',
    method: 'POST',
    data: info
  })
}
// 行政管理
// 获取试题库列表
export function getQuestionInfo(info) {
  return request({
    url: '/ad/itembank-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 获取未添加的试题库列表
export function getExamFifter(info, list) {
  return request({
    url: '/ad/itembank-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'POST',
    data: list
  })
}
// 新增试题
export function saveQuestion(info) {
  return request({
    url: '/ad/itembank-create.json',
    method: 'POST',
    data: info
  })
}
// 编辑试题
export function updateQuestion(id, info) {
  return request({
    url: '/ad/itembank-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 作废试题
export function banQuestion(id) {
  return request({
    url: '/ad/itembank-cancellation-' + id + '.json',
    method: 'GET'
  })
}

// 日常考试
// 获取日常考试列表
export function getExamInfo(info) {
  return request({
    url: '/ad/dailypaper-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增日常考试试卷
export function saveExam(info) {
  return request({
    url: '/ad/dailypaper-create.json',
    method: 'POST',
    data: info
  })
}
// 查看日常考试试卷
export function viewExam(id) {
  return request({
    url: '/ad/dailypaper-edit-' + id + '.json',
    method: 'GET'
  })
}
export function copyExam(id) {
  return request({
    url: '/ad/dailypaper-copy-' + id + '.json',
    method: 'GET'
  })
}
// 更新日常考试试卷
export function updateExam(id, info) {
  return request({
    url: '/ad/dailypaper-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 发布日常考试试卷
export function releaseExam(id) {
  return request({
    url: '/ad/dailypaper-publish-' + id + '.json',
    method: 'GET'
  })
}
// 作废日常考试试卷
export function banExam(id) {
  return request({
    url: '/ad/dailypaper-cancellation-' + id + '.json',
    method: 'GET'
  })
}
// 绩效考核
// 获取绩效考核列表
export function getPerformanceInfo(info) {
  return request({
    url: '/ad/performance-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增绩效考核试卷
export function savePerformance(info) {
  return request({
    url: '/ad/performance-create.json',
    method: 'POST',
    data: info
  })
}
// 查看绩效考核试卷
export function viewPerformance(id) {
  return request({
    url: '/ad/performance-edit-' + id + '.json',
    method: 'GET'
  })
}
// 复制绩效考核试卷
export function copyPerformance(id, info) {
  return request({
    url: '/ad/performance-copy-' + id + '.json',
    method: 'GET'
  })
}

// 更新绩效考核试卷
export function updatePerformance(id, info) {
  return request({
    url: '/ad/performance-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 作废绩效考核试卷
export function banPerformance(id) {
  return request({
    url: '/ad/performance-cancellation-' + id + '.json',
    method: 'GET'
  })
}

// 问卷调查
// 获取问卷调查列表
export function getSurveyInfo(info) {
  return request({
    url: '/ad/survey-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 新增问卷调查试卷
export function saveSurvey(info) {
  return request({
    url: '/ad/survey-create.json',
    method: 'POST',
    data: info
  })
}
// 查看问卷调查试卷
export function viewSurvey(id) {
  return request({
    url: '/ad/survey-edit-' + id + '.json',
    method: 'GET'
  })
}
// 复制问卷调查试卷
export function copySurvey(id) {
  return request({
    url: '/ad/survey-copy-' + id + '.json',
    method: 'GET'
  })
}
// 更新问卷调查试卷
export function updateSurvey(id, info) {
  return request({
    url: '/ad/survey-edit-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 作废问卷调查试卷
export function banSurvey(id) {
  return request({
    url: '/ad/survey-cancellation-' + id + '.json',
    method: 'GET'
  })
}
// 发布问卷调查
export function releaseSurvey(id) {
  return request({
    url: '/ad/survey-publish-' + id + '.json',
    method: 'GET'
  })
}
// 考试历史
// 考试历史列表
export function dailyexamList(info) {
  return request({
    url: '/ad/dailyexam-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 查看考试历史试卷题目
export function viewExamPaper(id) {
  return request({
    url: '/ad/dailyexam-answer-' + id + '.json',
    method: 'GET'
  })
}
// 提交考试答案
export function answerExamPaper(id, info) {
  return request({
    url: '/ad/dailyexam-doanswer-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 提交考试审批分数
export function approvalExamPaper(id, info) {
  return request({
    url: '/ad/dailyexam-approve-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 查看考试历史结果
export function resultExamPaper(id) {
  return request({
    url: '/ad/dailyexam-view-' + id + '.json',
    method: 'GET'
  })
}

// 绩效历史
// 绩效历史列表
export function performanceExamList(info) {
  return request({
    url: '/ad/performanceexam-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}
// 查看绩效历史试卷题目
export function viewExamPerformance(id) {
  return request({
    url: '/ad/performanceexam-answer-' + id + '.json',
    method: 'GET'
  })
}
// 提交绩效答案
export function answerExamPerformance(id, type, info) {
  return request({
    url: '/ad/performanceexam-doanswer-' + type + '-' + id + '.json',
    method: 'POST',
    data: info
  })
}

// 提交主要负责人绩效评价
export function answerSuperPerformance(id, info) {
  return request({
    url: '/ad/performanceexam-approve-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 查看绩效考核结果
export function resultExamPerformance(id) {
  return request({
    url: '/ad/performanceexam-view-' + id + '.json',
    method: 'GET'
  })
}
// 问卷历史
// 问卷历史列表
export function questionnaireHistory(info) {
  return request({
    url: '/ad/surveyexam-browse-' + info.mode + '-' + info.search + '-' + info.orderBy + '-' + info.recTotal + '-' + info.recPerPage + '-' + info.pageID + '.json',
    method: 'GET'
  })
}

// 查看问卷历史试卷题目
export function viewquestPaper(id) {
  return request({
    url: '/ad/surveyexam-answer-' + id + '.json',
    method: 'GET'
  })
}
// 提交问卷答案
export function answerquestPaper(id, info) {
  return request({
    url: '/ad/surveyexam-doanswer-' + id + '.json',
    method: 'POST',
    data: info
  })
}
// 查看结果
export function resultquestPaper(id) {
  return request({
    url: '/ad/surveyexam-view-' + id + '.json',
    method: 'GET'
  })
}
// 问卷查看详情
export function detailquestPaper(id) {
  return request({
    url: '/ad/surveyexam-statistics-' + id + '.json',
    method: 'GET'
  })
}
