'use strict';

module.exports = function (app) {
  const projects = {};

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      // let issue_title = req.query.issue_title;
      // let issue_text = req.query.issue_text;
      // let created_by = req.query.created_by;
      // let assigned_to = req.query.assigned_to;
      // let status_text = req.query.status_text;
      // let created_on = req.query.created_on;
      // let updated_on = req.query.updated_on;
      // let _id = req.query._id;
      // let open = req.query.open;

      let respond = projects[project];
      // console.log('get respond', respond);
      for (let key in req.query) {
        if (!respond) break;
        respond = respond.filter(entry => entry[key] == req.query[key])
      }
      
      // console.log('get filtered respond', respond);
      return res.json(respond);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to || "";
      let status_text = req.body.status_text || "";
      let created_on = new Date();
      let updated_on = new Date();
      let _id = createRandomId(10);
      let open = true;
      let respond;
      
      if (!(issue_title && issue_text && created_by)) respond = { error: 'required field(s) missing' };
      else {

        respond = {issue_text, issue_title, created_by, assigned_to, status_text, created_on, updated_on, _id, open};
        if (! projects.hasOwnProperty(project)) projects[project] = []
        projects[project].push(respond);
      }
      // console.log(respond);

      return res.json(respond)
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let _id = req.body._id;
      let respond;
      let reqFields = Object.keys(req.body);
      // console.log('reqFields',reqFields);

      if (! _id) respond = { error: 'missing _id' }
      else if (reqFields.every(field => field === '_id' || field !== '_id' && !req.body[field])) respond = { error: 'no update field(s) sent', '_id': _id }
      else {
        // console.log(projects[project]);
        // console.log('enryID',projects[project][0]._id);
        let entryIndex = projects[project].findIndex(entry => entry._id === _id)
        if (entryIndex < 0) respond = { error: 'could not update', '_id': _id }
        else {
          reqFields.forEach(field => {
            if (req.body[field]) {
              projects[project][entryIndex][field] = req.body[field];
            }
          });
          projects[project][entryIndex].updated_on = new Date();
          respond = {  result: 'successfully updated', '_id': _id }
        }
      }
      // console.log('PUT respond', respond);
      return res.json(respond)
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let _id = req.body._id;
      let respond;

      if (! _id) respond = { error: 'missing _id' }
      else {
        let entryIndex = projects[project].findIndex(entry => entry._id === _id)
        if (entryIndex < 0) respond = { error: 'could not delete', '_id': _id }
        else {
          projects[project].splice(entryIndex, 1);
          respond = { result: 'successfully deleted', '_id': _id }
        }
      }
      return res.json(respond)
    });

    function createRandomId(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
    
};
