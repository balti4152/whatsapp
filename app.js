



const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
let DATOS_FORMULARIOS = {}

const flowFotos = addKeyword(["continuar"]).addAnswer("🖇️ Ahora te toca subir tus fotos y comprobantes! mira el instructivo para saber como sacarte las fotos! ☝🏻",{media:"https://i.imgur.com/bvWjgSJ.png"}).addAnswer("⚠️ Una vez termines de subir todas las fotos y el comprobante de transferencia, escribir *subidas* 🥰 ")

const FlowSubidas = addKeyword(["subidas"]).addAnswer("🎉  Genial! ya esta todo listo, espera a que generemos tu ficha final, un representante se comunicará con vos en los proximos dias!")

const flowForm = addKeyword(['1']).addAnswer("⚠️ Para poder generar tu ficha de paciente, es necesario contar con el comprobante de pago de la consulta, se abona por medio de transferencia $15000 por unica vez")
.addAnswer("CBU: 1430001713006462010010")
.addAnswer(
    ' Es tu *primera consulta* con el Dr.Jose Cardenas ?',{capture:true}, (ctx)=>{
        DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], primeraConsulta:ctx.body}
    })
.addAnswer(
    'Como es tu *Nombre* ?',{capture:true}, (ctx)=>{
        DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], nombre:ctx.body}
        console.log(DATOS_FORMULARIOS[ctx.from].nombre) 
    }).addAnswer(
        'Como es tu *Apellido* ?',{capture:true}, (ctx)=>{
            DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], apellido:ctx.body}
        }).addAnswer(
            ' tu *Edad* ?',{capture:true}, (ctx)=>{
                DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], edad:ctx.body}
            }).addAnswer(
                'Domicilio completo/país:',{capture:true}, (ctx)=>{
                    DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], domicilio:ctx.body}
                }).addAnswer(
                    'Como es tu *numero de telefono* ?',{capture:true}, (ctx)=>{
                        DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], telefono:ctx.body}
                    }).addAnswer(
                        'Edad del *último hijo* ? (en caso de no tener, contestar "no tengo")',{capture:true}, (ctx)=>{
                            DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], ultimoHijo:ctx.body}
                        }).addAnswer(
                            ' *Alergias* ? cual? (en caso de no tener, contestar "no tengo")',{capture:true}, (ctx)=>{
                                DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], alergias:ctx.body}
                                
                            }).addAnswer(
                                ' Enfermedades *congénitas y/o crónicas* ?',{capture:true}, (ctx)=>{
                                    DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], enfermedades:ctx.body}
                                }).addAnswer(
                                    ' Está bajo algún *tratamiento de salud* ? (En caso de ser afirmativa enunciar la medicación que toma para dicho caso) (Psicológico/físico/Psíquiatrico)',{capture:true}, (ctx)=>{
                                        DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], tratamiento:ctx.body}
                                    }).addAnswer(
                                        ' *Motivo de consulta* ?', {capture:true}, async (ctx, {flowDynamic}) => {
                                            const d = new Date();

                                            DATOS_FORMULARIOS[ctx.from] = {...DATOS_FORMULARIOS[ctx.from], motivo:ctx.body}
                                            return flowDynamic(`Genial *${DATOS_FORMULARIOS[ctx.from].nombre}*! te dejo el resumen de tu formulario
                                            \n- Fecha: ${(d.getDay()+"/"+(d.getMonth()+1)+"/"+d.getFullYear())}
                                            \n- Es primera Consulta?: *${DATOS_FORMULARIOS[ctx.from].primeraConsulta}*
                                            \n- Nombre y Apellidos: *${DATOS_FORMULARIOS[ctx.from].nombre} ${DATOS_FORMULARIOS[ctx.from].apellido}*
                                            \n- Edad *${DATOS_FORMULARIOS[ctx.from].edad}*
                                            \n- Domicilio completo/país: *${DATOS_FORMULARIOS[ctx.from].domicilio}*
                                            \n- Telefono: *${DATOS_FORMULARIOS[ctx.from].telefono}*
                                            \n- Edad del último hijo ? *${DATOS_FORMULARIOS[ctx.from].ultimoHijo}*
                                            \n- Alergias: *${DATOS_FORMULARIOS[ctx.from].alergias}*
                                            \n- Enfermedades congénitas y/o crónicas: *${DATOS_FORMULARIOS[ctx.from].enfermedades}*
                                            \n- Está bajo algún tratamiento de salud? *${DATOS_FORMULARIOS[ctx.from].tratamiento}*
                                            \n- Motivo de consulta: *${DATOS_FORMULARIOS[ctx.from].motivo}*`)
                                        }).addAnswer(
                                            [
                                                ' Ya casi estamos, escribir *"continuar"* para finalizar tu ficha!',
                                            ],
                                            null,
                                            null,
                                            [flowFotos]
                                        )

                                        const flowHumano = addKeyword(["2"]).addAnswer( 
                                            "👨🏻‍💻 Por favor, espera unos minutos hasta ser atendido."
                                        )     
                                        
                                        const flowSubmit = addKeyword(["media"]).addAnswer(
                                            "✅ Recibí tu imagen con exito, una vez termines de subir tus fotos, escribir *Subidas* 🥰 ",
                                          );
                                          

const flowPrincipal = addKeyword(['hola', "HOL", "ficha"])
    .addAnswer('🤖 *Hola! ¿Cómo estás?*')
    .addAnswer('En que te puedo ayudar?')
    .addAnswer(
        [
            'Escribir 1 o 2 para seleccionar opcion',
            '📋 *1* Armar mi ficha de paciente!',
            '👨🏻‍💻 *2* Hablar con un representante',
        ],
        null,
        null,
        [flowForm, flowHumano]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal,FlowSubidas,flowSubmit])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
