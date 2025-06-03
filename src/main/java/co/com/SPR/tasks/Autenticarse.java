package co.com.SPR.tasks;
import net.serenitybdd.screenplay.actions.SelectFromOptions;
import co.com.SPR.models.CredencialesInicio;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;


import java.util.List;

import static co.com.SPR.userinterface.Autenticacion.*;

public class Autenticarse implements Task {
    private List<CredencialesInicio> credenciales;


    public  Autenticarse(List<CredencialesInicio> credenciales){
        this.credenciales = credenciales;
    }

    public static Autenticarse aute(List<CredencialesInicio> credenciales){
        return Instrumented.instanceOf(Autenticarse.class).withProperties(credenciales);
    }


    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                SelectFromOptions.byVisibleText(credenciales.get(0).getRol()).from(INPUT_ROL),
                Click.on(INPUT_CORREO),
                Enter.theValue(credenciales.get(0).getUsuario()).into(INPUT_CORREO),
                Click.on(INPUT_CONTRASENA),
                Enter.theValue(credenciales.get(0).getClave()).into(INPUT_CONTRASENA),
                Click.on(BTN_INICIOSESION)
        );
    }
}
