package co.com.SPR.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Visibility;
import static co.com.SPR.userinterface.Campos.*;
public class ValidacionInicioSesion implements Question<Boolean>{
    public static ValidacionInicioSesion validacionInicioSesion(){return new ValidacionInicioSesion();}

    @Override
    public Boolean answeredBy(Actor actor){return Visibility.of(BTN_USUARIO_VERIFICAR).viewedBy(actor).asBoolean();
    }

}
