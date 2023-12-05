const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://notas:hector@cluster0.j23gcga.mongodb.net/?retryWrites=true&w=majority');

const eventoSchema = new mongoose.Schema({
    fechaHoy: String,
    fechaEvento: String,
    titulo: String,
    descripcion: String,
});

const Evento = mongoose.model('Evento', eventoSchema);

app.get('/', async (req, res) => {
    const eventos = await Evento.find();
    res.render('index', { eventos });
});

app.get('/nuevo', (req, res) => {
    res.render('nuevo');
});


app.post('/nuevo', async (req, res) => {
    const { fechaHoy, fechaEvento, titulo, descripcion } = req.body;
    const nuevoEvento = new Evento({ fechaHoy, fechaEvento, titulo, descripcion });
    await nuevoEvento.save();
    res.redirect('/');
});


app.get('/editar/:id', async (req, res) => {
    const evento = await Evento.findById(req.params.id);
    res.render('editar', { evento });
});

app.post('/editar/:id', async (req, res) => {
    const { fechaHoy, fechaEvento, titulo, descripcion } = req.body;
    await Evento.findByIdAndUpdate(req.params.id, { fechaHoy, fechaEvento, titulo, descripcion });
    res.redirect('/');
});

app.get('/eliminar/:id', async (req, res) => {
    await Evento.findByIdAndDelete(req.params.id);
    res.redirect('/');
});



app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});
