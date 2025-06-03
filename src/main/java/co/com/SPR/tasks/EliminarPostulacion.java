package co.com.SPR.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.SPR.userinterface.Campos.*;

public class EliminarPostulacion implements Task {
    EliminarPostulacion eLiminarPostulacion;

    public static EliminarPostulacion eliminarPostulacion() {
        return Tasks.instrumented(EliminarPostulacion.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_PRESTADORES),
                Click.on(BTN_POSTULARSE),
                Click.on(BTN_ELIMINARPOSTULACION)
        );
    }
}
