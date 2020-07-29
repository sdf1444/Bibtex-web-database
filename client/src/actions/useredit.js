import axios from 'axios';

export const updateUser = async (userObj, password, id) => {
    const result = {};
    const updateFields = async () => {
        try {
            const res = await axios.put('/api/user/' + id, userObj);
            result.fields = { message: res.data.msg, ok: res.data.success };
            console.log(res.data)
        } catch (err) {
            result.fields = { message: err.response.data.msg, ok: err.response.data.success };
        }
    }
    const updatePassword = async () => {
        if (password !== '') {
            try {
                const res = await axios.put(
                    '/api/user/updatePassword/' + id, { password }
                );
                console.log(res.data)
                result.password = { message: res.data.msg, ok: res.data.success };
                }
            catch (err) {
                result.password = {message: err.response.data.msg, ok: err.response.data.success}
            }
        }
    }
    await Promise.all([updateFields(), updatePassword()]);
    return result;
}  