const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowComentarios = addKeyword([' ', '']).addAnswer(
    [
       "Gracias por tus comentarios! 😊"
    ],
    null,
    null,
    
)



const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
       "Gracias a vos!"
    ],
    null,
    null,
    
)

const flow45 = addKeyword(['4',"5"]).addAnswer(
    ["Gracias por tu tiempo!, nos serviria mucho que nos dejes una valoración positiva en google!  🥰"],
    null,
    null,
    
).addAnswer(
["https://g.co/kgs/MKs67T"]
)

const flow13 = addKeyword(['1',"2","3"]).addAnswer(
    ['en que podría mejorar nuestro servicio?'],
    null,
    null,
    [flowComentarios]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo', "ola", "HOL", "valorar"])
    .addAnswer('🙌 *Hola! ¿Cómo estás?*')
    .addAnswer('Podrias valorar nuestro servicio? 😉')
    .addAnswer(
        [
            'Por favor, valorá nuestro servicio de 1 a 5 estrellas',
            '👉 *1* 😣',
            '👉 *2*  😑',
            '👉 *3* 🫠',
            '👉 *4* 😊',
            '👉 *5* 🥰',
        ],
        null,
        null,
        [flow45,flow13, flowGracias]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
