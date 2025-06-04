package co.com.SPR.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.SPR.userinterface.Campos.BTN_ELiMINARPORTAFOLIO;
import static co.com.SPR.userinterface.Campos.BTN_PORTAFOLIO;

public class EliminarPortafolio implements Task {
    EliminarPortafolio eliminarPortalfolio;

    public static EliminarPortafolio eliminarportafolio(){
        return Tasks.instrumented(EliminarPortafolio.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_PORTAFOLIO),
                Click.on(BTN_ELiMINARPORTAFOLIO)
        );
    }
}