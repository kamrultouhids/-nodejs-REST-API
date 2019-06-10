var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/authenticate');
let Validator = require('validatorjs');
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);

router.get('/',authenticate,(req, res) => {
     knex('tasks').then(response => {
         if (response.length > 0) {
            return res.json({ code: 200, message: 'success', data: response});
         } else {
             return res.json({ code: 200, message: 'Data Not found', data: []});
         }
     }).catch((error) => {
         console.log( error);
         throw error;
     });
});

router.get('/:id',authenticate,(req, res) => {
    let task_id = req.params.id;
    knex('tasks').where('id', task_id).then((response) => {
        if (response.length > 0) {
            return res.json({ code: 200, message: 'success', data: response[0]});
        } else {
            return res.json({ code: 200, message: 'Data Not found', data: null});
        }
    }).catch((error) => {
            console.log( error);
        throw error;
    });
});

router.post('/',authenticate, async(req,res) => {
    let validation = new Validator(req.body, {
        name: 'required',
    },{
        "required.name": "The task name field is required.",
    });

    const { name } = req.body;
    let result = await knex('tasks').where('name',name);

    let uniqueValidationFails = false;
    if (result.length > 0) {
         uniqueValidationFails = true;
    }

    if (validation.fails() || uniqueValidationFails) {
        if (uniqueValidationFails) {
            validation.errors.errors['name'] = ["Task name field must be unique."];
        }
        return res.json({code: 422, message: validation.errors.all(), data: null});
    }

    knex('tasks').insert({name: name}).then(response => {
        return res.json({ code: 200, message: 'Task successfully saved.', data: null});
    }).catch(error => {
        if (error.errno == 1062) {
            return res.json({ code: 400, message: 'Task name must be unique.', data: null});
        }
        return res.json({ code: 400, message: 'something error found, please try again.', data: null});
    });
});

router.put('/',authenticate, async(req, res) => {
    let validation = new Validator(req.body, {
        name: 'required',
    },{
        "required.name": "The task name field is required!",
    });

    const { id, name } = req.body;
    let result = await knex('tasks').where('name',name).where('id','!=',id);

    let uniqueValidationFails = false;
    if (result.length > 0) {
        uniqueValidationFails = true;
    }

    if (validation.fails() || uniqueValidationFails) {
        if (uniqueValidationFails) {
            validation.errors.errors['name'] = ["Task name field must be unique."];
        }
        return res.json({code: 422, message: validation.errors.all(), data: null});
    }
	
    knex('tasks').where('id',id).update({name: name}).then(response => {
        return res.json({ code: 200, message: 'Task successfully update.', data: null});
    }).catch(error => {
        if (error.errno == 1062) {
            return res.json({ code: 400, message: 'Task name must be unique.', data: null});
        }
        return res.json({ code: 400, message: 'something error found, please try again.', data: null});
    });
});

router.delete('/:id',authenticate, (req, res) => {
    let id = req.params.id;
    knex('tasks').where('id',id).del().then(response => {
        return res.json({ code: 200, message: 'Task delete successfully.', data: null});
    });
});

router.get('/search/:keyword',authenticate, (req, res) => {
    let keyword = req.params.keyword;
    knex('tasks').where('name', 'like','%'+ keyword +'%').then((response) => {
        if (response.length > 0) {
            return res.json({ code: 200, message: 'success', data: response});
        } else {
            return res.json({ code: 200, message: 'Data Not found', data: []});
        }
    }).catch((error) => {
        console.log(error);
        throw error;
    });
});

module.exports = router;
