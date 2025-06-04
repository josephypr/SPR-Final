package co.com.SPR.tasks;
import co.com.SPR.models.DatosActualizar;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Clear;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.ensure.Ensure;
import net.serenitybdd.screenplay.waits.WaitUntil;

import java.util.List;

import static co.com.SPR.userinterface.Campos.*;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isClickable;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

public class ActualizarContratista implements Task {

    private List<DatosActualizar> datosActualizar;

    public ActualizarContratista(List<DatosActualizar> datosActualizar) {
        this.datosActualizar = datosActualizar;
    }

    public static ActualizarContratista actualizar(List<DatosActualizar> datosActualizar) {
        return Instrumented.instanceOf(ActualizarContratista.class).withProperties(datosActualizar);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_USUARIO),

                Click.on(BTN_PERFIL),

                Click.on(BTN_EDITAR_PERFIL),

                // Limpiar campo
                Clear.field(INPUT_TELEFONO),

                // Esperar a que el campo esté listo
                WaitUntil.the(INPUT_TELEFONO, isClickable()).forNoMoreThan(5).seconds(),

                // Ingresar el nuevo valor
                Enter.theValue(datosActualizar.get(0).getTelefonos()).into(INPUT_TELEFONO),

                // Verificar que el valor se ingresó correctamente
                Ensure.that(INPUT_TELEFONO).value().isEqualTo(datosActualizar.get(0).getTelefonos()),

                // Esperar a que el botón de guardar esté listo
                WaitUntil.the(BTN_GUARDAR, isVisible()).forNoMoreThan(5).seconds(),

                // Guardar los cambios
                Click.on(BTN_GUARDAR)
        );
    }
}
