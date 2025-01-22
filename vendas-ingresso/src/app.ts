import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message:"HW"})
});

app.post('/auth/login', (req,res) => {
    const { email, password } = req.body;
    res.send();
})

app.post('/partners', (req, res) => {
    const { name, email, password, company_name } = req.body;
    console.log(name, email, password, company_name);
    res.send();
});

app.post('/customers', (req,res) =>{
    const { name, email, password, address, telefone } = req.body;
    console.log(name, email, password, address, telefone);
    res.send();
});

app.post('/partners/events', (req, res) => {
    const { name, description, date, location } = req.body;
    console.log(name, description, date, location);
    res.send();
});

app.post('/partners/events/:eventId', (req, res) => {
    const {eventId} = req.params;
    console.log(eventId);
    res.send();
});

app.post('/events', (req, res) => {
    const { name, description, date, location } = req.body;
    console.log(name, description, date, location);
    res.send();
});

app.post('/events/:eventId', (req, res) => {
    const {eventId} = req.params;
    console.log(eventId);
    res.send();
});

app.listen(3000, () => {
    console.log('Running in http://localhost:3000');
}); 