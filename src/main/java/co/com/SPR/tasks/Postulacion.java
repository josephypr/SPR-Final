package co.com.SPR.tasks;


import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.SPR.userinterface.Campos.BTN_POSTULARSE;
import static co.com.SPR.userinterface.Campos.BTN_PRESTADORES;

public class Postulacion implements Task {

    Postulacion postulacion;

    public static Postulacion aUnaOferta() {
        return Tasks.instrumented(Postulacion.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(BTN_PRESTADORES),
                Click.on(BTN_POSTULARSE)
        );
    }
}