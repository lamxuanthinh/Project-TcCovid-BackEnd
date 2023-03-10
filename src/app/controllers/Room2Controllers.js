const Room2 = require("../models/Room2");
const Room3 = require("../models/Room3");
const Room = require("../models/Room");
const User = require("../models/User");

class Room2Controllers {

    async show(req, res) {
        let rooms = await Room2.find();
        if (rooms.length > 0) {
            res.send(rooms);
        }
        else {
            res.send("No rooms found");
        }
    }

    // async add(req, res) {
    //     let roomId = req.body.RoomId
    //     let idCard = req.body.IdCard
    //     let room = await Room.findOne({ RoomId: roomId });
    //     let user = await User.findOne({ IdCard: idCard });
    //     let newUser = new User({
    //         IdCard: idCard,
    //         phoneNumber: req.body.phoneNumber,
    //         name: req.body.name,
    //         gender: req.body.gender,
    //         address: req.body.address,
    //         province: req.body.province,
    //         district: req.body.district,
    //         wards: req.body.wards,
    //         nationality: req.body.nationality,
    //         numberBHYT: req.body.numberBHYT,
    //         dateOfBirth: req.body.dateOfBirth
    //     })
    //     if (room) {
    //         let room2 = await Room2.findOne({ RoomId: roomId });
    //         if (room2) {
    //             if (user) {
    //                 let result = await Room2.updateOne(
    //                     { RoomId: roomId },
    //                     {
    //                         $addToSet: {
    //                             Data: user
    //                         }
    //                     }
    //                 )
    //                 res.send(true)
    //             }
    //             else {
    //                 let addUser = await newUser.save()
    //                 let result = await Room2.updateOne(
    //                     { RoomId: roomId },
    //                     {
    //                         $addToSet: {
    //                             Data: user
    //                         }
    //                     }
    //                 )
    //                 res.send(true);
    //             }
    //         } else {
    //             let newRoom2 = new Room2({
    //                 RoomId: roomId
    //             })

    //             let result = await newRoom2.save();

    //             if (result) {
    //                 let user = await User.findOne({ IdCard: idCard });
    //                 if (user) {
    //                     let result = await Room2.updateOne(
    //                         { RoomId: roomId },
    //                         {
    //                             $addToSet: {
    //                                 Data: user
    //                             }
    //                         }
    //                     )
    //                     res.send(result)
    //                 }
    //                 else {
    //                     let addUser = await newUser.save()
    //                     let result = await Room2.updateOne(
    //                         { RoomId: roomId },
    //                         {
    //                             $addToSet: {
    //                                 Data: user
    //                             }
    //                         }
    //                     )
    //                     res.send(true);
    //                 }
    //             }
    //             else {
    //                 res.send("T???o ph??ng 2 kh??ng th??nh c??ng");
    //             }
    //         }

    //     }
    //     else {
    //         res.send("Kh??ng t??m th???y ph??ng");
    //     }
    //     const query = { "RoomId": `${roomId}`, "Data.IdCard": `${idCard}` }
    //     const updateDocument = {
    //         $set: { "Data.$.status": "02" }
    //     };
    //     const result = await Room2.updateOne(query, updateDocument);
    // }

    async finish(req, res) {
        let roomId = req.body.RoomId
        let idCard = req.body.IdCard

        // th??m ng?????i d??ng v??o ph??ng ba
        // --------------------------------------------------------------------------
        let room3 = await Room3.findOne({ RoomId: roomId })
        if (room3) {
            let user = await User.findOne({ IdCard: idCard })
            if (user) {
                let userRoom2 = await Room2.findOne(
                    { RoomId: roomId },
                    {
                        Data: {
                            $elemMatch: {
                                IdCard: idCard
                            }
                        }
                    }
                )
                let statusUser = (userRoom2.Data)[0].status
                if (statusUser == 'wait') {
                    let updatedRoom3 = await Room3.updateOne(
                        { RoomId: req.body.RoomId },
                        {
                            $addToSet: {
                                Data: user
                            }
                        }
                    )
                    if (updatedRoom3) {
                        res.send(true);
                    }
                    else {
                        res.send(false);
                    }
                }
                else {
                    res.send('Theo tu???n t???')
                }
            }
            else {
                res.send('Kh??ng t??m th???y ng?????i ti??m ch???ng')
            }
        }
        else {
            let user = await User.findOne({ IdCard: idCard })
            if (user) {
                let newRoom3 = await Room3({
                    RoomId: roomId,
                    Data: user
                });

                let createdRoom3 = await newRoom3.save()
                res.send(createdRoom3);
            }
            else {
                res.send('Kh??ng c?? user');
            }
        }

        // X??a ng?????i d??ng kh???i room 2
        let removeUser = await Room2.updateOne(
            { RoomId: roomId },
            {
                $pull: {
                    Data: {
                        IdCard: idCard
                    }
                }
            }
        )
    }

    async getFirstUser(req, res) {
        let idCard
        let roomId = req.params.RoomId
        let room2 = await Room2.findOne({ RoomId: roomId });
        if (room2) {
            let user, firstUser
            let users = room2.Data;
            for (user of users) {
                firstUser = user
                idCard = user.IdCard
                break;
            }
            if (firstUser) {
                res.send(firstUser);
            }
            else {
                res.send("khong co user");
            }
        }
    }

    async add(req, res) {
        let idCard = req.body.IdCard;
        let roomId = req.body.RoomId;
        let user = new User({
            IdCard: idCard,
            phoneNumber: req.body.phoneNumber,
            name: req.body.name,
            gender: req.body.gender,
            address: req.body.address,
            province: req.body.province,
            district: req.body.district,
            wards: req.body.wards,
            nationality: req.body.nationality,
            numberBHYT: req.body.numberBHYT,
            dateOfBirth: req.body.dateOfBirth,
        })

        let addUser = await user.save();

        let room2 = await Room2.findOne({ RoomId: roomId });
        if (room2) {
            const query = { "RoomId": `${roomId}`, "Data.IdCard": `${idCard}` }
            const updateDocument = {
                $set: { "Data.$.status": "02" }
            };
            let result = await Room2.updateOne(
                { RoomId: roomId },
                {
                    $addToSet: {
                        Data: user
                    }
                }
            )

            const updatestatus = await Room2.updateOne(query, updateDocument);
            if (result) {
                res.send(true)
            }
        }
        else {
            let newRoom2 = new Room2({
                RoomId: roomId
            })

            let createRoom2 = await newRoom2.save();
            if (createRoom2) {
                const query = { "RoomId": `${roomId}`, "Data.IdCard": `${idCard}` }
                const updateDocument = {
                    $set: { "Data.$.status": "02" }
                };
                let result = await Room2.updateOne(
                    { RoomId: roomId },
                    {
                        $addToSet: {
                            Data: user
                        }
                    }
                )

                const updatestatus = await Room2.updateOne(query, updateDocument);
                if (result) {
                    res.send(true)
                }
            }
        }
    }



    async getListUser(req, res) {
        let room2 = await Room2.find();
        if (room2) {
            res.send(room2)
        }
    }

    async delete(req, res) {
        let roomId = req.body.RoomId
        let idCard = req.body.IdCard
        let user = await User.findOne({ IdCard: idCard })

        if (user) {
            // X??a user ???? ??? v??? tr?? ?????u
            let removeUser = await Room2.updateOne(
                { RoomId: roomId },
                {
                    $pull: {
                        Data: {
                            IdCard: idCard
                        }
                    }
                }
            )
            // ?????y xu???ng cu???i list

            let udateUser = await Room2.updateOne(
                { RoomId: roomId },
                {
                    $addToSet: {
                        Data: user
                    }
                }
            )

            res.send(true)
        }
        else {
            res.send(false)
        }

    }

}

module.exports = new Room2Controllers
