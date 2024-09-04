'use strict';

module.exports = function (app) {
  const projects = {};

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;

      let respond = projects[project];
      for (let key in req.query) {
        if (!respond) break;
        respond = respond.filter(entry => entry[key] == req.query[key])
      }
      
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

      return res.json(respond)
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let _id = req.body._id;
      let respond;
      let reqFields = Object.keys(req.body);

      if (! _id) respond = { error: 'missing _id' }
      else if (reqFields.every(field => field === '_id' || field !== '_id' && !req.body[field])) respond = { error: 'no update field(s) sent', '_id': _id }
      else {
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
