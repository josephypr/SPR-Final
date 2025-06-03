package co.com.SPR.tasks;

import co.com.SPR.models.CredencialesInicio;
import co.com.SPR.models.DatosActualizar;
import co.com.SPR.userinterface.PerfilContratista;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.actions.Scroll;
import net.serenitybdd.screenplay.actions.ScrollTo;

import java.util.List;

import static co.com.SPR.userinterface.Autenticacion.INPUT_CORREO;
import static co.com.SPR.userinterface.Campos.*;

public class ActualizarContratista implements Task {

    private List<DatosActualizar> datosActualizar;

    public ActualizarContratista(List<DatosActualizar> datosActualizar) { this.datosActualizar = datosActualizar;}

    public static ActualizarContratista actualizar(List<DatosActualizar> datosActualizar){
        return Instrumented.instanceOf(ActualizarContratista.class).withProperties(datosActualizar);
    }

    @Override
    public <T extends Actor> void performAs(T actor){
        actor.attemptsTo(
            Click.on(BTN_USUARIO),
            Click.on(BTN_PERFIL),
            Click.on(BTN_EDITAR_PERFIL),
            Enter.theValue("").into(INPUT_TELEFONO), // Limpia el campo primero
            Enter.theValue(datosActualizar.get(0).getTelefonos()).into(INPUT_TELEFONO),
            Click.on(BTN_GUARDAR)
    );}
}
