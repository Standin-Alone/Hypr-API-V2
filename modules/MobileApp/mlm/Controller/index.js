const express = require('express');
const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.raw());


const methods = {};
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;

async function _isNormalDay(params) {
  const value = 0;
  const accessibles = {
    docs: params[value].docs,
    userId: params[value].userId,
    orderId: params[value].orderId,
    markUp: params[value].markUp,
    is_reverse_day: params[value].is_reverse_day,
    downlineCount: 7,
  };
  const users = [];
  const buyer = [{ id: accessibles.userId }];
  users.push(...buyer);

  _getCurrentRecruiter(accessibles.userId)
    .then((first) => {
      if (checkResultCount(first)) {
        users.push(...first);
        _getCurrentRecruiter(first[value].id).then((second) => {
          if (checkResultCount(second)) {
            users.push(...second);
            _getCurrentRecruiter(second[value].id).then((third) => {
              if (checkResultCount(third)) {
                users.push(...third);
                _getCurrentRecruiter(third[value].id).then((fourth) => {
                  if (checkResultCount(fourth)) {
                    users.push(...fourth);
                    _getCurrentRecruiter(fourth[value].id).then((fifth) => {
                      if (checkResultCount(fifth)) {
                        users.push(...fifth);
                        _getCurrentRecruiter(fifth[value].id).then((sixth) => {
                          if (checkResultCount(fifth)) {
                            users.push(...sixth);
                            _getCurrentRecruiter(sixth[value].id).then(
                              (seventh) => {
                                if (checkResultCount(seventh)) {
                                  users.push(...seventh);
                                  _disseminateRewards(_formatData(params, users));
                                }
                              }
                            );
                          } else {
                            _disseminateRewards(_formatData(params, users));
                          }
                        });
                      } else {
                        _disseminateRewards(_formatData(params, users));
                      }
                    });
                  } else {
                    _disseminateRewards(_formatData(params, users));
                  }
                });
              } else {
                _disseminateRewards(_formatData(params, users));
              }
            });
          } else {
            _disseminateRewards(_formatData(params, users));
          }
        });
      }
    });
}

function checkResultCount(data) {
  return data.length !== 0 ? true : false;
}

function _formatData(params, users) {
  const value = 0;
  const data = [
    {
      docs: params[value].docs,
      users: users,
      is_reverse_day: params[value].is_reverse_day,
      markUp: params[value].markUp,
      orderId: params[value].orderId,
      userId: params[value].userId,
    },
  ];

  return data;
}

async function _getCurrentRecruiter(_id) {
  try {
    return new Promise(function (resolve, reject) {
      db.collection('r_teams')
        .find({ recruited_id: { $eq: _id } })
        .project({ id: '$recruiter_id', _id: 0 })
        .toArray(function (err, items) {
          err ? reject(err) : resolve(items);
        });
    });
  } catch (error) {
    console.log(error);
  } finally {
  }
}

function _distributeRewards(userId, amount, orderId) {
  _insertBalance(userId, amount, orderId);
  _updateBalance(userId, amount, orderId);
}

async function _insertBalance(userId, amount, orderId) {

  return await db.collection('t_rewards').insertMany([
    {
      user_id: userId,
      reward_balance: amount,
      order_id: orderId,
      reward_status: 'pending',
      date_created: new Date(),
    },
  ]);
}

async function _updateBalance(userId, amount, orderId) {
  const u_id = new ObjectId(userId);

  const query = await db.collection('users').find({ _id: u_id });

  query.toArray(function (err, docs) {
    docs.forEach((documents) => {
      const updated_reward = documents.reward + amount;
      db.collection('users').updateOne(
        { _id: u_id },
        { $set: { reward: updated_reward } }
      );

      db.collection('t_rewards_history').insertMany([
        {
          user_id: userId,
          order_id: orderId,
          old_reward: documents.reward,
          new_reward: updated_reward,
          date_created: new Date(),
        },
      ]);
    });
  });
}

function isReverseDay(day) {
  const today = new Date();
  return day === today.getDay() ? true : false;
}

methods.insertRewards = async (req, res) => {
  allRewards()
    .then((result) => processRewards(result, req))
    .catch((error) => {
      console.log(error);
    });

  res.json({ response: 'success' });
};


async function getAllRecuits(userId) {
  try {
    return new Promise(function (resolve, reject) {
      db.collection('r_teams')
        .find({ recruiter_id: { $eq: userId } })
        .limit(10)
        .project({ id: '$recruited_id', _id: 0 })
        .toArray(function (err, items) {
          err ? reject(err) : resolve(items);
        });
    });
  } catch (error) {
    console.log(error);
  } finally {
  }
}

async function processRewards(items, request) {
  try {
    return new Promise(function (resolve, reject) {
      const markUp = request.body.markUp;
      const orderId = request.body.orderId;
      const userId = request.body.userId;
      // const reverse = request.body.reverse;

      const lastItem = items.find(
        (item) => item.name.toLowerCase() === 'reverse day'
      );

      const day = _.toNumber(lastItem.percent);
      const is_reverse_day = isReverseDay(day);

      try {
        if (is_reverse_day) {
          getAllRecuits(userId).then((result) => {
            const params = [{
                docs: [...items],
                users: [...result],
                is_reverse_day: is_reverse_day,
                markUp: markUp,
                orderId: orderId,
                userId: userId,
              },
            ];
            _disseminateRewards(params);
            resolve();
          });
        } else {
          const params = [{
              docs: [...items],
              is_reverse_day: is_reverse_day,
              markUp: markUp,
              orderId: orderId,
              userId: userId,
            },
          ];
          _isNormalDay(params);
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function _disseminateRewards(params) {
  const values = 0;
  const accessibles = {
    recruiter: 'recruiter',
    recruiter_upline: 'recruiter upline',
    hypr: 'hypr',
    buyer: 'buyer',
    userCount: params[values].users.length,
    rIndex: parseInt(params[values].docs[1].percent),
    uIndex: parseInt(params[values].docs[2].percent),
    markUp: params[values].markUp,
    is_reverse_day: params[values].is_reverse_day,
    userId: params[values].userId,
    users: params[values].users,
    orderId: params[values].orderId,
    recruiterUplineCount: 2,
    isOnlyOneUser: 1,
  };

  const countfiltered = accessibles.users.filter((element) => {
      return element.id !== accessibles.userId;
  }).length;

  params[values].docs.map( async (item, index) => {
    const role = _.toLower(item.name);
    const hyprKickBack = _.round( accessibles.markUp / 2, 2 );
    const buyerKickBack = hyprKickBack / 2;

    if (role === accessibles.hypr) {
      const hyprUser = await db.collection('users').findOne({ role: { $eq: role } });
      if (hyprUser && hyprUser._id) {
        // console.log(`hypr: ${hyprUser._id}, amount: ${hyprKickBack}`);
        _distributeRewards(hyprUser._id, hyprKickBack, accessibles.orderId);
      }
    } else if (role === accessibles.buyer && accessibles.userId) {
      _distributeRewards(accessibles.userId, buyerKickBack, accessibles.orderId);
    } else if (role === accessibles.recruiter && accessibles.is_reverse_day) {
      if (countfiltered > 0) {
        const recruiterKickBack = getKickBack(hyprKickBack, countfiltered);
        for (let i = 0, j = accessibles.users.length; i < j; i++) {
          if (accessibles.users[i].id !== accessibles.userId) {
            _distributeRewards(accessibles.users[i].id, recruiterKickBack, accessibles.orderId);
          }
        }
      }
    } else if (role === accessibles.recruiter_upline && !accessibles.is_reverse_day) {
      if (countfiltered > 0) {
        const uplineKickBack = getKickBack(hyprKickBack, countfiltered);
        for (let i = 0, j = accessibles.users.length; i < j; i++) {
          if (accessibles.users[i].id !== accessibles.userId) {
            _distributeRewards(accessibles.users[i].id, uplineKickBack, accessibles.orderId);
          }
        }
      }
    }
  }); 
}

function getKickBack(markUp, userCount) {
  const count = userCount || 0;

  if (count > 0) {
    return _.round( (_.round( markUp / 2, 2 ) ) / count, 2);
  }

  return (_.round( markUp / 2, 2 ) ) || 0;
}

async function allRewards() {
  try {
    return new Promise(function (resolve, reject) {
      db.collection('r_rewards')
        .find()
        .project({ name: 1, percent: 1, _id: 0 })
        .toArray(function (err, items) {
          err ? reject(err) : resolve(items);
        });
    });
  } catch (error) {
    console.log(error);
  } finally {
  }
}

methods.recruiteMember = async (req, res) => {
  
  const data = req.body.team;

  if (data) {
    const team = data.map(v => ({...v, date_created: new Date() }))

    const query = db.collection('r_teams').insertMany(team);

    (query) ? res.json({ response: 'success' }) : res.status(500).send({ error: '500' });
  }
};

methods.updator = async (req, res) => {

  const userId = req.body.userId;
  const collectionName = req.body.collection;
  const valuesToUpdate = req.body.values;

  const u_id = new ObjectId(userId);

  const query = db.collection(collectionName).updateOne(
    { _id: u_id },
    { $set: valuesToUpdate }
  );
  
  (query) ? res.json({ response: 'success' }) : res.status(500).send({ error: '500' });

};


methods.getMembers = async (req, res) => {

  try{
    // initialize body        
    
    let userId = req.body.userId;

    let getAllMembersByRecruited =   await TeamsSchema.find({recruiter_id:userId});
    let getAllMembersByRecruiter =   await TeamsSchema.find({recruited_id:userId});
    
    let cleanGetAllMembersByRecruited = getAllMembersByRecruited.map((item)=>item.recruited_id);
    let cleanGetAllMembersByRecruiter = getAllMembersByRecruiter.map((item)=>item.recruiter_id);

    let cleanGetAllMembers  = [...cleanGetAllMembersByRecruited,...cleanGetAllMembersByRecruiter]

    // cleanGetAllMembers.push(userId);
    
 
    let getAllCleanMembers = await UsersSchema.find({_id : {$in:cleanGetAllMembers}}).sort({date_created: -1});

    if(getAllCleanMembers.length > 0 ){

        // GET ALL MEMBERS 
        let getUserMembers = getAllCleanMembers.map( async (member,index)=>{      
             member.user_picture = member.profile_image ? member.user_picture : 'default-profile.png';                   
             return member;
        })

      
        
        return res.send({
            status:true,
            message:'Successfully got all members.',
            data:await Promise.all(getUserMembers)
        }) 
        
    }else{
        return res.send({
            status:false,
            message:'Failed to get all post.',                
        })
    }
           
}catch(error){
    console.log(error);
    res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
}


};



module.exports = methods;