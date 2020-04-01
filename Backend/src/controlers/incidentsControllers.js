const connection = require('../database/connection');

module.exports ={
    async index(request, response) {
        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                "incidents.*",
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response) {
        const {title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id });
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        if (!request.headers || !ong_id) {
            return response.status(401).send({ error: 'Você não tem permissão, verifique se está logado no sistema' });
        }
        
        if (isNaN(id)) {
            return response.status(400).send({ error: 'Não foi informado o ID do incidente, ou está incorreto' });
        }
        
        const incidents = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (!incidents || !incidents.lenght) {
            return response.status(400).send({ error: 'Não foi encontrado nenhum caso para a ong informada' });
        }

        if (incidents.ong_id !== ong_id){
            return response.status(401).json({ error: 'Operatiosns not permitted' });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
};